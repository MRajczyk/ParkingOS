import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";
import { format } from 'date-fns';

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { id } = getRouterParams(event);

  try {
    type ParkingSpaceInfo = {
      spaceId: number;
      floor: number;
      placeNumber: number;
      parkingName: String;
      parkingAddress: String;
      city: String;
    };

    type CarSessionData = {
      carId: number;
      carName: String;
      registrationNumber: String;
      sumForCar: number;
      sessions: {
        id: number;
        entranceDate: Date;
        leaveDate: Date;
        totalCost: number;
        spaceId: number;
        placeNumber: number;
        floor: number;
        parkingName: String;
        parkingAddress: String;
        city: String;
      }[];
    };

    const parkingSpaceInfo: ParkingSpaceInfo[] = [];

    const allParkings = await prisma.parking.findMany();

    for (const parking of allParkings) {
      const parkingSpaces = await prisma.parkingSpace.findMany({
        where: {
          parkingId: parking.id,
        },
        orderBy: {
          id: 'asc',
        },
      });

      const parkingSpacesOnFloor = parking.parkingPlacesPerFloor;
      const totalFloors = parking.floors;

      let spaceIdCounter = 0;

      for (let floor = 1; floor <= totalFloors; floor++) {
        for (let placeNumber = 1; placeNumber <= parkingSpacesOnFloor; placeNumber++) {
          if (spaceIdCounter >= parkingSpaces.length) {
            break;
          }

          const space = parkingSpaces[spaceIdCounter];
          const parkingSpace = {
            spaceId: space.id,
            floor,
            placeNumber: spaceIdCounter + 1,
            parkingName: parking.name,
            parkingAddress: parking.address,
            city: parking.city,
          };

          parkingSpaceInfo.push(parkingSpace);
          spaceIdCounter++;
        }

        if (spaceIdCounter >= parkingSpaces.length) {
          break;
        }
      }
    }

    const cars = await prisma.car.findMany({
      where: {
        parkingSessions: {
          some: {
            parkingId: Number(id),
          },
        },
      },
    });

    const resultData: CarSessionData[] = [];

    for (const car of cars) {
      const carSessions = await prisma.parkingSession.findMany({
        where: {
          carId: car.id,
          parkingId: Number(id),
          leaveDate: {
            not: null,
          },
        },
      });

      if (carSessions.length > 0) {
        const sumForCar = carSessions.reduce((sum, session) => sum + session.finalCost, 0);

        const carData: CarSessionData = {
          carId: car.id,
          carName: car.name,
          registrationNumber: car.registrationNumber,
          sumForCar: sumForCar,
          sessions: carSessions.map((session) => {
            const infos = parkingSpaceInfo.find((info) => info.spaceId == session.spot);
            if (infos) {
              return {
                id: session.id,
                entranceDate: format(new Date(session.entranceDate), 'yyyy-MM-dd HH:mm:ss'),
                leaveDate: format(new Date(session.leaveDate), 'yyyy-MM-dd HH:mm:ss'),
                totalCost: session.finalCost,
                spaceId: infos.spaceId,
                placeNumber: infos.placeNumber,
                floor: infos.floor,
                parkingName: infos.parkingName,
                parkingAddress: infos.parkingAddress,
                city: infos.city,
              };
            } else {
              return null;
            }
          }).filter((data) => data !== null) as any,
        };

        resultData.push(carData);
      }
    }

    return {
      statusCode: 200,
      filteredResultData: resultData,
     };
  } catch (error) {
    console.error(error);
    throw createError({
      statusMessage: "Error fetching car details",
      statusCode: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
});
