import React, {useState} from 'react';

import { SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useQuery } from '@apollo/react-hooks';
import { queries } from '../../Queries';

const Home: React.FC<any> = ({ navigation }) => {
  const [user, setUser] = useState({ userId: 'a0a74650-052d-49be-bffd-3a87c600cf2e', username: 'Charlie'})
  const { data, loading, error } = useQuery(queries.GET_GROUPS, { variables: { userId: user.userId }})
    
  if (!loading && data){
    const buttons = data.getGroups.map((group: any, index: any) => {
      return (
        <Button
          onPress={() => {
            navigation.navigate('GroupDashboard', { groupId: group.id, userId: user.userId });
          }}
          key={index + group.groupName}
        >
          <Text small>{group.groupName}</Text>
        </Button>
      );
    });
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Header>
            <Text primary title>
              Welcome, {user.username}
            </Text>
          </Header>
          <Divider />
          <Groups>
          <Text primary large style={{color: "slategray", marginBottom: 15}}>
              Groups
            </Text>
            {buttons}
          </Groups>
          <Footer>
            <Button
              onPress={() => {
                navigation.navigate('Setup', { userId: user.userId });
              }}
            >
              <Text large>ADD GROUP</Text>
            </Button>
          </Footer>
        </Container>
      </SafeAreaView>
    );
  } else if(!loading && data === undefined) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Header>
            <Text primary title>
              Welcome, Username
            </Text>
          </Header>
          <Divider />
          <Groups>
            <Text primary large style={{color: "slategray"}}>
              You have no groups!
            </Text>
          </Groups>
          <Footer>
            <Button
              onPress={() => {
                navigation.navigate('Setup', { userId: user.userId });
              }}
            >
              <Text large>ADD GROUP</Text>
            </Button>
          </Footer>
        </Container>
      </SafeAreaView>
    )
  } else {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
        <ActivityIndicator size='large' color='#0000ff' />
      </SafeAreaView>
    );
  }
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  justify-content: center;
  padding: 20px 5%;
  margin-bottom: 20px;
`;

const Header = styled.View`
  justify-content: center;
  align-items: center;
`;

const Groups = styled.View`
  flex: 1;
  align-items: center;
  margin: 20px 0;
  padding-top: 10px;
  border-radius: 15px;
`;
const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const Text = styled.Text`
  color: ${(props: any) => (props.primary ? 'lightpink' : 'white')};
  font-family: 'AvenirNext-Regular';
  ${({ title, small, large }) => {
    switch (true) {
      case title:
        return 'font-size: 32px';
      case large:
        return 'font-size: 26px';
      case small:
        return 'font-size: 20px';
    }
  }}
`;

const Divider = styled.View`
  border-bottom-color: lightpink;
  border-bottom-width: 2px;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  width: 90%;
  padding: 8px;
  background-color: lightpink;
  border-radius: 10px;
  margin-bottom: 10px;
`;

export default Home;
