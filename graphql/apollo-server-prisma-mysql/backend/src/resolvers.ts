import { Photo, Prisma, User } from "@prisma/client";
import { GraphQLScalarType, StringValueNode } from "graphql";
import { authorizeWithGitHub } from "./github.js";
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
    allUsers: (_parent, _args, { db }: MyContext) => db.user.findMany({}),
    me: (_parent, _args, { currentUser }: MyContext) => currentUser,
  },
  Mutation: {
    postPhoto: async (_parent, args, { db, currentUser }: MyContext) => {
      if (!currentUser) {
        throw new Error("only an authorized user can post a photo");
      }

      const newPhoto = {
        ...args.input,
        userId: currentUser.id,
        created: new Date(),
      };

      const createdPhoto = await db.photo.create({
        data: newPhoto,
      });
      return createdPhoto;
    },
    githubAuth: async (_parent, { code }, { db }: MyContext) => {
      const { message, access_token, avatar_url, login, name } =
        await authorizeWithGitHub({
          client_id: process.env["GRAPHQL_LEARNING_GITHUB_CLIENT_ID"],
          client_secret: process.env["GRAPHQL_LEARNING_GITHUB_CLIENT_SECRET"],
          code,
        });

      if (message) {
        throw new Error(message);
      }

      const upsertParameter: Prisma.UserCreateInput = {
        name,
        githubLogin: login,
        githubToken: access_token,
        avatar: avatar_url,
      };

      const user = await db.user.upsert({
        create: upsertParameter,
        update: upsertParameter,
        where: {
          githubLogin: login,
        },
      });

      return { user, token: access_token };
    },
    addFakeUsers: async (root, { count }, { db }: MyContext) => {
      const randomUserApi = `https://randomuser.me/api/?results=${count}`;

      const { results } = await fetch(randomUserApi).then(
        async (response) =>
          (await response.json()) as {
            results: [
              {
                login: {
                  username: string;
                  sha1: string;
                };
                name: {
                  first: string;
                  last: string;
                };
                picture: {
                  thumbnail: string;
                };
              }
            ];
          }
      );

      const users: Prisma.UserCreateManyInput[] = results.map((result) => {
        return {
          githubLogin: result.login.username,
          name: `${result.name.first} ${result.name.last}`,
          avatar: result.picture.thumbnail,
          githubToken: result.login.sha1,
        };
      });

      await db.user.createMany({
        data: users,
      });

      return await db.user.findMany({
        where: {
          githubLogin: {
            in: users.map((user) => user.githubLogin),
          },
        },
      });
    },
    fakeUserAuth: async (parent, { githubLogin }, { db }: MyContext) => {
      const user = await db.user.findFirst({
        where: {
          githubLogin,
        },
      });

      if (!user) {
        throw new Error(`Cannot find user with githubLogin ${githubLogin}`);
      }

      return {
        token: user.githubToken,
        user,
      };
    },
  },
  Photo: {
    url: (parent: Photo) => `https://test/img/${parent.id}.jpg`,
    postedBy: async (parent: Photo, _args, { db }: MyContext) => {
      return await db.user.findFirst({
        where: {
          id: parent.userId,
        },
      });
    },
    taggedUsers: async (parent: Photo, _args, { db }: MyContext) => {
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
    postedPhotos: async (parent: User, _args, { db }: MyContext) => {
      return await db.photo.findMany({ where: { userId: parent.id } });
    },
    inPhotos: async (parent: User, _args, { db }: MyContext) => {
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
