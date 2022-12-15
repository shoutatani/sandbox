export const users = [
    { githubLogin: "mHattrup", name: "Mike Hattrup" },
    { githubLogin: "gPlake", name: "Glen Plake" },
    { githubLogin: "sSchmidt", name: "Scot Schmidt" },
];
export const photoId = () => photos
    .map((photo) => photo.id)
    .sort()
    .reverse()[0];
export const photos = [
    {
        id: 1,
        name: "Dropping the Heart Chute",
        description: "The heart chute is one of my favorite chutes",
        category: "ACTION",
        githubUser: "gPlake",
    },
    {
        id: 2,
        name: "Enjoying the sunshine",
        category: "SELFIE",
        githubUser: "sSchmidt",
    },
    {
        id: 3,
        name: "Gunbarrel 25",
        description: "25 laps on gunbarrel today",
        category: "LANDSCAPE",
        githubUser: "sSchmidt",
    },
];
