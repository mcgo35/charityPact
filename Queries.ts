import { gql } from 'apollo-boost';

export const queries = {
  GET_GROUPS: gql`
    query getGroups($userId: ID!) {
      getGroups(userId: $userId) {
        groupName
        id
      }
    }
  `,
  GET_GROUP: gql`
    query getIndividualGroup($groupId: ID!) {
      getIndividualGroup(groupId: $groupId) {
        id
        groupName
        goalName
        amount
        charityLink
        deadline
        members {
          username
          daysCompleted
          completedToday
        }
      }
    }
  `,
  COMPLETE_TASK: gql`
    mutation completeTask($userId: ID!, $groupId: ID!) {
      completeTask(userId: $userId, groupId: $groupId) {
        id
        groupName
        goalName
        amount
        charityLink
        deadline
        members {
          username
          daysCompleted
          completedToday
        }
      }
    }
  `,
  CREATE_GROUP: gql`
    mutation createGroup($group: GroupInput) {
      createGroup(group: $group) {
        groupName
      }
    }
  `,
  GET_USER: gql`
    query getUser($username: String!) {
      getUser(username: $username) {
        id
        username
      }
    }
  `,
};
