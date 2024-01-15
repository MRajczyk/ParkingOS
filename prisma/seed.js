const { PrismaClient, Role } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Creating users
  const user1 = await prisma.user.create({
    data: {
      name: 'user',
      surname: 'test',
      email: 'user@test.com',
      password: '$2a$12$MHXnE9dBsczEpbvYFwibxuE1CrBaJw.AtxDzsLv3ILsBO6PinmedC',
      role: 'USER',
      balance: 10.0,
      isBanned: false,
      cars: {
        create: {
          registrationNumber: 'ABC123',
          name: 'Fiat Punto',
          isParked: false,
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'admin',
      surname: 'test',
      email: 'admin@test.com',
      password: '$2a$12$2GVH21Kn8uEuVCUYv.ffa.oOmx/zQWtYrGT47CKZv5raqNdFApsM6',
      role: 'ADMIN',
      balance: 50.0,
      isBanned: false,
    },
  });

  // Creating charge plan
  // const dateA = new Date(2024, 1, 1, 20, 0);
  // const dateB = new Date(2024, 1, 1, 8, 0);
  // const chargePlan = await prisma.chargePlan.create({
  //   data: {
  //     parking: {
  //       create: {
  //         name: 'City Center Parking',
  //         city: 'Łódź',
  //         address: '123 Main St',
  //         floors: 3,
  //         parkingPlacesPerFloor: 50,
  //         chargePlanId: 1,
  //       },
  //     },
  //     nightStart: dateA, 
  //     nightEnd: dateB,
  //     dayHour1Tariff: 5.0,
  //     dayHour2Tariff: 4.0,
  //     dayHour3Tariff: 3.0,
  //     dayHour4Tariff: 2.0,
  //     nightHour1Tariff: 4.0,
  //     nightHour2Tariff: 3.0,
  //     nightHour3Tariff: 2.0,
  //     nightHour4Tariff: 1.0,
  //     nightTariffStartHour: 1.0,
  //   },
  // });

  // // Creating parking
  // const parking = await prisma.parking.create({
  //   data: {
  //     name: 'City Center Parking',
  //     city: 'Łódź',
  //     address: '123 Main St',
  //     floors: 3,
  //     parkingPlacesPerFloor: 50,
  //     chargePlanId: chargePlan.id,
  //   },
  // });

  // // Creating parking spaces
  // const parkingSpace1 = await prisma.parkingSpace.create({
  //   data: {
  //     ocuppied: false,
  //     parking: {
  //       connect: {
  //         id: parking.id,
  //       },
  //     },
  //   },
  // });

  // const parkingSpace2 = await prisma.parkingSpace.create({
  //   data: {
  //     ocuppied: false,
  //     parking: {
  //       connect: {
  //         id: parking.id,
  //       },
  //     },
  //   },
  // });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
