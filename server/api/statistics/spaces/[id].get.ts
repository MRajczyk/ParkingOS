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
      parkingName: string;
      parkingAddress: string;
      city: string;
    };

    type SpaceSessionData = {
      spaceId: number;
      floor: number;
      placeNumber: number;
      sumForSpace: number;
      parkingName: string;
      parkingAddress: string;
      city: string;
      sessions: {
        id: number;
        entranceDate: Date;
        leaveDate: Date;
        totalCost: number;
        carName: string;
        registrationNumber: string;
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

    const spaces = await prisma.parkingSpace.findMany({
      where: {
        parkingId: Number(id),
      },
    });

    const resultData: SpaceSessionData[] = [];

    for (const space of spaces) {
      const spaceSessions = await prisma.parkingSession.findMany({
        where: {
          spot: space.id,
          parkingId: Number(id),
          leaveDate: {
            not: null,
          },
        },
        include: {
          car: true,
        },
      });

      if (spaceSessions.length > 0) {
        const sumForSpace = spaceSessions.reduce((sum, session) => sum + session.finalCost, 0);

        const spaceInfo = parkingSpaceInfo.find(info => info.spaceId === space.id);

        if (spaceInfo) {
          const spaceData: SpaceSessionData = {
            spaceId: spaceInfo.spaceId,
            floor: spaceInfo.floor,
            placeNumber: spaceInfo.placeNumber,
            sumForSpace: sumForSpace,
            parkingName: spaceInfo.parkingName,
            parkingAddress: spaceInfo.parkingAddress,
            city: spaceInfo.city,
            sessions: spaceSessions.map((session) => {
              return {
                id: session.id,
                entranceDate: format(new Date(session.entranceDate), 'yyyy-MM-dd HH:mm:ss'),
                leaveDate: format(new Date(session.leaveDate!), 'yyyy-MM-dd HH:mm:ss'),
                totalCost: session.finalCost,
                carName: session.car.name,
                registrationNumber: session.car.registrationNumber,
              };
            }),
          };

          resultData.push(spaceData);
        }
      }
    }

    return {
      statusCode: 200,
      filteredResultData: resultData,
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusMessage: "Error fetching space details",
      statusCode: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
});
