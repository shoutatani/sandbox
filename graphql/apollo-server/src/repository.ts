export type UserType = {
  githubLogin: string;
  name: string;
};

export const users: UserType[] = [
  { githubLogin: "mHattrup", name: "Mike Hattrup" },
  { githubLogin: "gPlake", name: "Glen Plake" },
  { githubLogin: "sSchmidt", name: "Scot Schmidt" },
];

export const photoId = () =>
  photos
    .map((photo) => photo.id)
    .sort()
    .reverse()[0];

export type PhotoType = {
  id: number;
  name: string;
  description?: string;
  category: string;
  githubUser: string;
  created: string;
};

export const photos: PhotoType[] = [
  {
    id: 1,
    name: "Dropping the Heart Chute",
    description: "The heart chute is one of my favorite chutes",
    category: "ACTION",
    githubUser: "gPlake",
    created: "3-28-1977",
  },
  {
    id: 2,
    name: "Enjoying the sunshine",
    category: "SELFIE",
    githubUser: "sSchmidt",
    created: "1-1-1985",
  },
  {
    id: 3,
    name: "Gunbarrel 25",
    description: "25 laps on gunbarrel today",
    category: "LANDSCAPE",
    githubUser: "sSchmidt",
    created: "2015-04-15T19:09:57.308Z",
  },
  {
    id: 4,
    name: "Test 4",
    description: "Test 4 photo description",
    category: "LANDSCAPE",
    githubUser: "gPlake",
    created: "4/18/2016",
  },
  {
    id: 5,
    name: "Test 5",
    description: "Test 5 photo description",
    category: "LANDSCAPE",
    githubUser: "gPlake",
    created: "4/18/2017 1:30:00 PM",
  },
  {
    id: 6,
    name: "Test 6",
    description: "Test 6 photo description",
    category: "LANDSCAPE",
    githubUser: "gPlake",
    created: "Sun Apr 16 2018 12:10:17 GMT-0700 (PDT)",
  },
  {
    id: 7,
    name: "Test 7",
    description: "Test 7 photo description",
    category: "LANDSCAPE",
    githubUser: "gPlake",
    created: "2019-01-02 12:34:56",
  },
  {
    id: 8,
    name: "Test 8",
    description: "Test 8 photo description",
    category: "LANDSCAPE",
    githubUser: "gPlake",
    created: "2020-01-02",
  },
];

export const tags = [
  { photoId: 1, userId: "gPlake" },
  { photoId: 2, userId: "sSchmidt" },
  { photoId: 2, userId: "mHattrup" },
  { photoId: 2, userId: "gPlake" },
];
