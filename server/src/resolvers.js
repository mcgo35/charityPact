const databaseAPI = require('../src/models/databaseAPI');

module.exports = {
  Query: {
    test: () => {
      console.log('hit server')
      return 'yes'
    },
    validateUser: async (_, { username, password }) => {
      const user = await databaseAPI.validateUser({ username, password });
      if (user) {
        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
          },
        };
      } else {
        return {
          success: false,
          user: null,
        };
      }
    },
    getUser: async (_, { username }) => {
      const user = await databaseAPI.getUser({ username });
      if (user) {
        return {
          id: user.id,
          username: user.username,
        };
      }
    },
    getGroups: async (_, { userId }) => {
      const groups = await databaseAPI.getGroups({ userId });
      const groupIds = [];
      groups.forEach((group) => groupIds.push([group.id]));

      const members = await databaseAPI.getMembers(groupIds);
      if (groups) {
        return {
          id: groups.id,
          groupName: groups.group_name,
          amount: groups.amount,
          goalName: groups.goal_name,
          charityLink: groups.charity_link,
          deadline: groups.deadline,
          members: members,
        };
      }
    },
  },
  Mutation: {
    createUser: async (_, { email, username, password }) => {
      const user = await databaseAPI.createUser({ email, username, password });
      return {
        id: user.id,
        username: user.username,
      };
    },
    createGroup: async (_, { group }) => {
      const newGroup = await databaseAPI.createGroup({ group });
      const members = await databaseAPI.addMembers({ group }, newGroup.id);
      return {
        id: newGroup.id,
        groupName: newGroup.group_name,
        amount: newGroup.amount,
        goalName: newGroup.goal_name,
        charityLink: newGroup.charity_link,
        deadline: newGroup.deadline,
        members: members,
      };
    },
  },
};
