import { photos, photoId, users } from "./repository.js";
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers = {
    Query: {
        totalPhotos: () => photos.length,
        allPhotos: () => photos,
    },
    Mutation: {
        postPhoto: (_parent, args) => {
            const newPhoto = {
                id: photoId() + 1,
                ...args.input,
            };
            photos.push(newPhoto);
            return newPhoto;
        },
    },
    Photo: {
        url: (parent) => `https://test/img/${parent.id}.jpg`,
        postedBy: (parent) => {
            return users.find((user) => user.githubLogin === parent.githubUser);
        },
    },
    User: {
        postedPhotos: (parent) => {
            return photos.filter((photo) => photo.githubUser === parent.githubLogin);
        },
    },
};
