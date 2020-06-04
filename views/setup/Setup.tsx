import React, { useState } from 'react';
import { SafeAreaView, View, Modal } from 'react-native';
import { Text, TextInput, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { queries } from '../../Queries';

const Setup: React.FC<any> = ({ route, navigation }) => {
  const { userId } = route.params;

  const [ createGroup ] = useMutation(queries.CREATE_GROUP);
  const [ getUser, { data } ] = useLazyQuery(queries.GET_USER);
  const [date, setDate] = useState<any>(new Date().toISOString());
  const [userfield, setUserfield] = useState<any>('');

  const [group, setGroup] = useState({
    userId,
    groupName: '',
    goalName: '',
    amount: 0,
    deadline: date,
    charityLink: '',
    members: []

  });
  const [modalView, setModalView] = useState(false);

  const updateUser = async () => {
    await getUser({variables: { username: userfield}})
    // if (data) {
    //   setGroup(prevState => {
    //     const membersCopy = prevState.members.slice();
    //     membersCopy.push(data.getUser)
    //     return {
    //       ...prevState,
    //       members: membersCopy,
    //     }
    //   })
    //   setUserfield('')
    // }
  }

  function Separator() {
    return <View style={styles.separator} />;
  }

  const onChange = (event: any, selectedDate: any) => {
    // selects and stores date as ISO string
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <Header>
          <Title>Create New Group</Title>
        </Header>
        <TextInput
          style={{ height: 40 }}
          placeholder='Enter Group Name'
          onChangeText={(text) => {
            setGroup(prevState => {
              return {
                ...prevState,
                groupName: text
              }
            })
          }}
        />
        <Separator />
        <TextInput
          style={{ height: 40 }}
          placeholder='Enter Group Goal'
          onChangeText={(text) => {
            setGroup(prevState => {
              return {
                ...prevState,
                goalName: text
              }
            })
          }}
        />
        <Separator />
        <TextInput
          style={{ height: 40 }}
          placeholder='Select Charity'
          onChangeText={(text) => {
            setGroup(prevState => {
              return {
                ...prevState,
                charityLink: text
              }
            })
          }}
        />
        <Separator />
        <TextInput
          style={{ height: 40 }}
          placeholder='Add Users'
          onChangeText={(text) => {
            setUserfield(text)
          }}
          value={userfield}
        />
        <Button onPress={updateUser}>
          <Text>Add</Text>
        </Button>
        <Separator />
        <TextInput
          style={{ height: 40 }}
          placeholder='Add Amount'
          onChangeText={(text) => {
            setGroup(prevState => {
              return {
                ...prevState,
                amount: +text
              }
            })
          }}
        />
        <Separator />
        <AddDateButton onPress={() => setModalView(true)}>
          <Text style={{color: "lightpink", fontSize: 18}}>Set End Date</Text>
        </AddDateButton>
        <Modal animationType='slide' transparent={true} visible={modalView}>
          <ModalView>            
            <DateTimePicker testID='dateTimePicker' value={date} mode='date' onChange={onChange}/>
            <ModalButton
              onPress={() => {
                setGroup((previousState) => {
                  return {
                    ...previousState,
                    deadline: date,
                  };
                });
                setModalView(false);
              }}
              >
              <Text>Enter</Text>
            </ModalButton>
          </ModalView>
        </Modal>
        <CreateButton onPress={() => {
          console.log(group)
          createGroup({ variables: {
            group
            // Brianna's code has new funcitonality for this component. May have to wait for her code in order to know where to trigger this mutation and if information is already in state.
          }})
        }}>
          <Text style={{color: "white", fontSize: 20}}>Create Group</Text>
        </CreateButton>
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  /* justify-content: center; */
  padding: 20px 5%;
  margin-bottom: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 30px;
`;

const Title = styled.Text`
  font-size: 35px;
  color: lightpink;
  font-family: 'AvenirNext-Regular';
  padding-bottom: 20px;
`;

const CreateButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  padding: 8px;
  background-color: lightpink;
  border-radius: 10px;
`;

const AddDateButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
  padding: 8px;
  background-color: azure;
  border: 1px solid lightblue;
  border-radius: 10px;
`;

const ModalView = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 200px 50px 100px;
`;

const ModalButton = styled.TouchableOpacity`
  padding: 8px 50px;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
  background-color: lightskyblue;
  border-radius: 5px;
`;


const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  padding: 8px;
  background-color: lightskyblue;
  border-radius: 10px;
  margin: 5px 0;
`;

export default Setup;
