// seed.js

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
      role: Role.USER, // Replace Role.USER with 'USER'
      balance: 10.0,
      isBanned: false,
      cars: {
        create: {
          registrationNumber: 'ABC123',
          name: 'Fiat Punto',
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
      role: Role.ADMIN, // Replace Role.ADMIN with 'ADMIN'
      balance: 50.0,
      isBanned: false,
    },
  });

  // Creating parking
  const parking = await prisma.parking.create({
    data: {
      name: 'City Center Parking',
      city: 'Łódź',
      address: '123 Main St',
      floors: 3,
      parkingPlacesPerFloor: 50,
      chargePlanId: 1,
      chargePlan: {
        create: {
          nightTariffStartHour: 20,
        },
      },
    },
  });

  // Creating parking spaces
  const parkingSpace1 = await prisma.parkingSpace.create({
    data: {
      ocuppied: false,
      parking: {
        connect: {
          id: parking.id,
        },
      },
    },
  });

  const parkingSpace2 = await prisma.parkingSpace.create({
    data: {
      ocuppied: false,
      parking: {
        connect: {
          id: parking.id,
        },
      },
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
