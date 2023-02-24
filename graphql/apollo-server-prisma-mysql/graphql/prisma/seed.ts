import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.photo.deleteMany({});
  await prisma.user.deleteMany({});

  const mike = await prisma.user.create({
    data: {
      name: "Mike Hattrup",
      githubLogin: "mHattrup",
      photos: {
        create: [
          {
            name: "Dropping the Heart Chute",
            description: "The heart chute is one of my favorite chutes",
            category: "ACTION",
            created: "3-28-1977",
          },
          {
            name: "Enjoying the sunshine",
            category: "SELFIE",
            created: "1-1-1985",
          },
        ],
      },
    },
    select: {
      id: true,
      photos: {
        select: {
          id: true,
        },
      },
    },
  });

  const glen = await prisma.user.create({
    data: {
      name: "Glen Plake",
      githubLogin: "gPlake",
      photos: {
        create: [
          {
            name: "Gunbarrel 25",
            description: "25 laps on gunbarrel today",
            category: "LANDSCAPE",
            created: "2015-04-15T19:09:57.308Z",
          },
          {
            name: "Test 4",
            description: "Test 4 photo description",
            category: "LANDSCAPE",
            created: "4/18/2016",
          },
          {
            name: "Test 5",
            description: "Test 5 photo description",
            category: "LANDSCAPE",
            created: "4/18/2017 1:30:00 PM",
          },
        ],
      },
    },
    select: {
      id: true,
      photos: {
        select: {
          id: true,
        },
      },
    },
  });

  const momo = await prisma.user.create({
    data: {
      name: "momo taro",
      githubLogin: "momo_taro",
      photos: {
        create: [
          {
            name: "Test 6",
            description: "Test 6 photo description",
            category: "LANDSCAPE",
            created: "Sun Apr 16 2018 12:10:17 GMT-0700 (PDT)",
          },
          {
            name: "Test 7",
            description: "Test 7 photo description",
            category: "LANDSCAPE",
            created: "2019-01-02 12:34:56",
          },
          {
            name: "Test 8",
            description: "Test 8 photo description",
            category: "LANDSCAPE",
            created: "2020-01-02",
          },
        ],
      },
    },
    select: {
      id: true,
      photos: {
        select: {
          id: true,
        },
      },
    },
  });

  await prisma.tag.createMany({
    data: mike.photos
      .map((photo) => {
        return [
          {
            userId: mike.id,
            photoId: photo.id,
          },
          {
            userId: glen.id,
            photoId: photo.id,
          },
          {
            userId: momo.id,
            photoId: photo.id,
          },
        ];
      })
      .flat(),
  });
  await prisma.tag.createMany({
    data: glen.photos
      .map((photo) => {
        return [
          {
            userId: mike.id,
            photoId: photo.id,
          },
          {
            userId: momo.id,
            photoId: photo.id,
          },
        ];
      })
      .flat(),
  });
  await prisma.tag.createMany({
    data: momo.photos
      .map((photo) => {
        return [
          {
            userId: momo.id,
            photoId: photo.id,
          },
          {
            userId: mike.id,
            photoId: photo.id,
          },
        ];
      })
      .flat(),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
