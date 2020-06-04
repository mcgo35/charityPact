const databaseAPI = require('../src/models/databaseAPI');
const combineGroups = require('../src/utils/combineGroups');

module.exports = {
  Query: {
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
        return user;
      } else {
        return null;
      }
    },
    getGroups: async (_, { userId }, context) => {
      const groups = await databaseAPI.getGroups({ userId });
      const groupIds = [];
      groups.forEach((group) => groupIds.push(group.id));
      const members = await databaseAPI.getMembers(groupIds);
      const combinedGroups = combineGroups(groups, members)
      return combinedGroups;
    },
    getIndividualGroup: async (_, { groupId }) => {
      const group = await databaseAPI.getIndividualGroup({ groupId });
      const members = await databaseAPI.getMembers([groupId]);
      const combinedGroups = combineGroups(group, members)[0]
      return combinedGroups;
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
      console.log('creating')
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
    completeTask: async (_, { userId, groupId }) => {
      await databaseAPI.completeTask({ userId, groupId });
      const groups = await databaseAPI.getGroups({ userId });      
      const groupIds = [];
      groups.forEach((group) => groupIds.push(group.id));
      const members = await databaseAPI.getMembers(groupIds);
      const combinedGroups = combineGroups(groups, members)[0]
      return combinedGroups;
    },
  },
};
