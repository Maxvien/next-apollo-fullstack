import bcrypt from 'bcrypt';
import { utils } from '~/backend/utils';
import { Resolvers } from '~/backend/types/graphql.type';

export const resolvers: Resolvers = {
  User: {
    posts: async (parent, args, context) => {
      const { getPostRepo } = context.dataSources.database;
      const pagination = { take: args.take || 10, skip: args.skip || 0 };

      return getPostRepo().find({ authorId: parent.id, ...pagination });
    }
  },
  Mutation: {
    signUpToGetToken: async (parent, args, context) => {
      const { getUserRepo, newUser } = context.dataSources.database;
      const password = bcrypt.hashSync(args.input.password, bcrypt.genSaltSync(8));
      const user = Object.assign(newUser(), args.input, { password });
      const { id } = await getUserRepo().save(user);

      return utils.auth.createToken(id);
    },
    signInToGetToken: async (parent, args, context) => {
      const { getUserRepo } = context.dataSources.database;
      const user = await getUserRepo().findOne({ username: args.input.username });
      const valid = bcrypt.compareSync(args.input.password, user.password);
      const token = utils.auth.createToken(user.id);

      return valid ? token : null;
    }
  },
  Query: {
    user: async (parent, args, context) => {
      const { getUserRepo } = context.dataSources.database;
      return getUserRepo().findOne({ id: args.id });
    }
  }
};