import { GraphQLScalarType, StringValueNode } from "graphql";
import { MyContext } from "./index.js";

export const resolvers = {
  Query: {
    totalPhotos: async (_parent, _args, { db }: MyContext) =>
      await db.photo.count(),
    allPhotos: async (_parent, args, { db }: MyContext) => {
      if (!args.after) {
        return db.photo.findMany();
      }
      return (await db.photo.findMany()).filter(
        (photo) => new Date(photo.created) >= new Date(args.after)
      );
    },
    totalUsers: (_parent, _args, { db }: MyContext) => db.user.count(),
  },
  Mutation: {
    postPhoto: async (_parent, args, { db }: MyContext) => {
      console.log("args=", args);
      const newPhoto = {
        ...args.input,
        created: new Date(),
      };
      const createdPhoto = await db.photo.create({
        data: newPhoto,
      });
      return createdPhoto;
    },
  },
  Photo: {
    url: (parent) => `https://test/img/${parent.id}.jpg`,
    postedBy: async (parent, _args, { db }: MyContext) => {
      return await db.user.findFirst({
        where: {
          id: parent.userId,
        },
      });
    },
    taggedUsers: async (parent, _args, { db }: MyContext) => {
      const userIds = (await db.tag.findMany({}))
        .filter((tag) => tag.photoId === parent.id)
        .map((tag) => tag.userId);

      const users = await db.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });

      return users;
    },
  },
  User: {
    postedPhotos: async (parent, _args, { db }: MyContext) => {
      return await db.photo.findMany({ where: { userId: parent.id } });
    },
    inPhotos: async (parent, _args, { db }: MyContext) => {
      const photoIds = (
        await db.tag.findMany({ where: { userId: parent.id } })
      ).map((tag) => tag.photoId);

      return await db.photo.findMany({ where: { id: { in: photoIds } } });
    },
  },
  DateTime: new GraphQLScalarType({
    name: `DateTime`,
    description: "A valid date time value.",
    parseValue: (value: string) => new Date(value),
    serialize: (value: any) => new Date(value).toISOString(),
    parseLiteral: (ast: StringValueNode) => new Date(ast.value),
  }),
};
