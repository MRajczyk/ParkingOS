import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { spaceId } = getRouterParams(event);

  try {
    type ParkingSpaceInfo = {
      spaceId: number;
      floor: number;
      placeNumber: number;
      parkingName: string;
      parkingAddress: string;
      city: string;
    };

    const parkingSpaceInfo: ParkingSpaceInfo[] = [];

    const space = await prisma.parkingSpace.findUnique({
      where: {
        id: Number(spaceId),
      },
      include: {
        parking: true, 
      },
    });
    const parkingSpaces = await prisma.parkingSpace.findMany({
      where: {
        parkingId: space.parkingId,
      },
      orderBy: {
        id: 'asc',
      },
    });
 
    const parkingSpacesOnFloor = space.parking.parkingPlacesPerFloor;
    const totalFloors = space.parking.floors;

    let spaceIdCounter = 0;
 
    for (let floor = 1; floor <= totalFloors; floor++) {
      for (let placeNumber = 1; placeNumber <= parkingSpacesOnFloor; placeNumber++) {
        if (spaceIdCounter >= parkingSpaces.length) {
          break;
        }

        const spacer = parkingSpaces[spaceIdCounter];
        const parkingSpace = {
          spaceId: spacer.id,
          floor,
          placeNumber: spaceIdCounter + 1,
          parkingName: space.parking.name,
          parkingAddress: space.parking.address,
          city: space.parking.city,
        };

        parkingSpaceInfo.push(parkingSpace);
        spaceIdCounter++;
      }

      if (spaceIdCounter >= parkingSpaces.length) {
        break;
      }
    }
 
 
  


    const parkingSessions = await prisma.parkingSession.findMany({
      where: {
        spot: Number(spaceId),
        leaveDate: {
          not: null,
        },
      },
      include: {
        car: true,
      },
      orderBy: {
        entranceDate: 'desc',
      },
    });

  
    const resultData = parkingSessions.map((session) => {
      if (session.car) {
        return {
          id: session.id,
          entranceDate: session.entranceDate,
          leaveDate: session.leaveDate,
          totalCost: session.finalCost,
          name: space.parking.name,
          carName: session.car.name,
          registrationNumber: session.car.registrationNumber,
        };
      } else {
        return null;
      }
    });

    const sortData = resultData.sort((a, b) => {
      const dateA = new Date(a.entranceDate);
      const dateB = new Date(b.entranceDate);

      return dateB.getTime() - dateA.getTime();
    });

   
    const filteredResultData = sortData.filter((data) => data !== null);
    const spaceInfo = parkingSpaceInfo.find((info) => Number(info.spaceId) === Number(spaceId));

    return {
      statusCode: 200,
      filteredResultData,
      floor: spaceInfo.floor,
      placeNumber: spaceInfo.placeNumber,
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
