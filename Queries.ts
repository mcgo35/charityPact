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
        groupName
        goalName
        amount
        charity
        deadline
        members
      }
    }
  `
};
