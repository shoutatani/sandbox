import { photos, photoId, users, tags, } from "./repository.js";
import { GraphQLScalarType } from "graphql";
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers = {
    Query: {
        totalPhotos: () => photos.length,
        allPhotos: (_parent, args) => {
            if (!args.after) {
                return photos;
            }
            return photos.filter((photo) => new Date(photo.created) >= new Date(args.after));
        },
    },
    Mutation: {
        postPhoto: (_parent, args) => {
            const newPhoto = {
                id: photoId() + 1,
                ...args.input,
                created: new Date(),
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
        taggedUsers: (parent) => {
            return tags
                .filter((tag) => tag.photoId === parent.id)
                .map((tag) => tag.userId)
                .map((userId) => users.find((user) => user.githubLogin === userId));
        },
    },
    User: {
        postedPhotos: (parent) => {
            return photos.filter((photo) => photo.githubUser === parent.githubLogin);
        },
        inPhotos: (parent) => {
            const photoIds = [
                ...new Set(tags
                    .filter((tag) => tag.userId === parent.githubLogin)
                    .map((tag) => tag.photoId)),
            ];
            return photoIds.map((photoId) => photos.find((photo) => photo.id === photoId));
        },
    },
    DateTime: new GraphQLScalarType({
        name: `DateTime`,
        description: "A valid date time value.",
        parseValue: (value) => new Date(value),
        serialize: (value) => new Date(value).toISOString(),
        parseLiteral: (ast) => new Date(ast.value),
    }),
};
