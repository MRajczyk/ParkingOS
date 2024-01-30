import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

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
    
    const parkingSpaceInfo: ParkingSpaceInfo[] = [];
    
    const allParkings = await prisma.parking.findMany();
    
    for (const parking of allParkings) {
      const parkingSpaces = await prisma.parkingSpace.findMany({
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
            placeNumber,
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
    
     const parkingSessions = await prisma.parkingSession.findMany({
      where: {
        carId:  Number(id),
        leaveDate: {
          not: null,
        },
      },
      include: {
        car: true,
      },
    });

 
    const resultData = parkingSessions.map((session) => {
      const parking = allParkings.find((parking) => parking.id === session.parkingId);
      const spaceInfo = parkingSpaceInfo.find(info => info.spaceId === session.spot);

      if (parking) {
        return {
           id: session.id,
          entranceDate: session.entranceDate,
          leaveDate: session.leaveDate,
          totalCost: session.finalCost,
          name: parking.name,
          city: parking.city,
          floor: spaceInfo.floor,
          placeNumber: spaceInfo.placeNumber,
          address: parking.address,
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

     return {
      statusCode: 200,
      filteredResultData,
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