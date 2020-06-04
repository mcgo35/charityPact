import * as React from 'react';
import { SafeAreaView, View, FlatList, Modal, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { queries } from '../../Queries';

const GroupDashboard: React.FC<any> = ({ route, navigation }): any => {
  const { groupId, userId } = route.params;
  // GRAPHQL QUERIES
  const { data, loading, error, refetch } = useQuery(queries.GET_GROUP, { variables: { groupId } });
  const [completeTask, { data: updatedGroup }] = useMutation(queries.COMPLETE_TASK);
  // LOCAL STATES
  const [completeModalVisible, setCompleteModalVisible] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [flag, setFlag] = React.useState(false);
  const [groupInformation, setGroupInformation] = React.useState({
    groupName: '',
    amount: 0,
    goalName: '',
    charityLink: '',
    deadline: undefined,
    members: [],
  });
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <ActivityIndicator size='large' color='#0000ff' />
      </SafeAreaView>
    );
  } else if (!loading && data) {
    if (!flag) {
      setGroupInformation((previousState) => {
        return {
          ...previousState,
          ...data.getIndividualGroup,
        };
      });
      setFlag(true);
    }

    const calculateTimeLeft = (date: any) => {
      const ms: number = date - new Date().getTime();
      if (ms < 0) return 'Deadline has passed';
      const days = Math.ceil(ms / 1000 / 60 / 60 / 24);
      return `${days} days left`;
    };

    navigation.setOptions({
      headerTitle: groupInformation.groupName,
      headerRight: () => (
        <EditButton
          onPress={() => {
            setEditModalVisible(true);
          }}
        >
          <Text style={{color: "dodgerblue"}}>Edit</Text>
        </EditButton>
      ),
    });
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Modal animationType='fade' transparent={true} visible={completeModalVisible}>
            <ModalView>
              <ModalBox>
                <Text title>Good job!</Text>
                <Text title style={{ fontSize: 80 }}>
                  🎉
                </Text>
                <Text small>You have completed today's task</Text>
                <ModalButton
                  onPress={() => {
                    setCompleteModalVisible(false);
                    refetch();
                    navigation.navigate('Home');
                  }}
                >
                  <Text>Close</Text>
                </ModalButton>
              </ModalBox>
            </ModalView>
          </Modal>
          <Modal animationType='fade' transparent={true} visible={editModalVisible}>
            <ModalView>
              <ModalBox style={{ height: 600 }}>
                <Text title>Edit</Text>
                <Formik
                  initialValues={groupInformation}
                  onSubmit={(values) => {
                    setGroupInformation((prevState) => {
                      return {
                        ...prevState,
                        ...values,
                      };
                    });
                    //! If we get to it, this is where we send an "edit group" mutation
                    setEditModalVisible(false);
                  }}
                >
                  {(formikProps) => (
                    <View style={{}}>
                      <InputGroup>
                        <Text small>Name:</Text>
                        <InputStyled
                          onChangeText={formikProps.handleChange('groupName')}
                          value={formikProps.values.groupName}
                        />
                      </InputGroup>
                      <Divider primary />
                      <InputGroup>
                        <Text small>Goal:</Text>
                        <InputStyled
                          onChangeText={formikProps.handleChange('goalName')}
                          value={formikProps.values.goalName}
                        />
                      </InputGroup>
                      <Divider primary />
                      <InputGroup>
                        <Text small>Donation:</Text>
                        <InputStyled
                          onChangeText={formikProps.handleChange('amount')}
                          value={formikProps.values.amount.toString()}
                        />
                      </InputGroup>
                      <Divider primary />
                      <InputGroup>
                        <Text small>Charity:</Text>
                        <InputStyled
                          onChangeText={formikProps.handleChange('charityLink')}
                          value={formikProps.values.charityLink}
                        />
                      </InputGroup>
                      <Divider primary />
                      <InputGroup>
                        <Text small>Deadline:</Text>
                        <InputStyled
                          onChangeText={formikProps.handleChange('deadline')}
                          value={formikProps.values.deadline!}
                        />
                      </InputGroup>
                      <ModalButton
                        style={{ backgroundColor: 'lightgreen' }}
                        onPress={formikProps.handleSubmit}
                      >
                        <Text large>Submit</Text>
                      </ModalButton>
                      <ModalButton
                        style={{ backgroundColor: 'crimson' }}
                        onPress={() => setEditModalVisible(false)}
                      >
                        <Text small style={{ color: 'white' }}>
                          Discard
                        </Text>
                      </ModalButton>
                    </View>
                  )}
                </Formik>
              </ModalBox>
            </ModalView>
          </Modal>
          <Header>
            <Text title>{groupInformation.goalName.toUpperCase()}</Text>
            <Text small>{calculateTimeLeft(groupInformation.deadline)}</Text>
          </Header>
          <Divider />
          <Info>
            <InfoBox>
              <Text small>Donation:</Text>
              <Text small>${groupInformation.amount}</Text>
            </InfoBox>
            <Divider primary />
            <InfoBox>
              <Text small>Charity:</Text>
              <Text small>{groupInformation.charityLink}</Text>
            </InfoBox>
          </Info>
          <Players>
            <Text title style={{ marginLeft: 142 }}>
              Players
            </Text>

            <FlatList
              data={groupInformation.members}
              ListHeaderComponent={
                <View style={{ marginBottom: 10 }}>
                  <PlayerRow>
                    <PlayerCell primary style={{ fontWeight: 'bold' }}>
                      Name
                    </PlayerCell>
                    <PlayerCell primary style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      Done
                    </PlayerCell>
                    <PlayerCell primary style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      Total
                    </PlayerCell>
                  </PlayerRow>
                  <Divider primary />
                </View>
              }
              renderItem={({ item, index }): any => {
                const checked =
                  item.completedToday === true ? (
                    <AntDesign name='checkcircleo' size={22} color='green' />
                  ) : (
                    <MaterialIcons name='radio-button-unchecked' size={24} color='red' />
                  );
                return (
                  <PlayerRow key={item.username + index}>
                    <PlayerCell primary>{item.username.toUpperCase()}</PlayerCell>
                    <PlayerCell primary style={{ textAlign: 'center' }}>
                      {checked}
                    </PlayerCell>
                    <PlayerCell primary style={{ textAlign: 'center' }}>
                      {item.daysCompleted}
                    </PlayerCell>
                  </PlayerRow>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
            />
          </Players>
          <View>
            <Buttons>
              <Button
                onPress={async () => {
                  setCompleteModalVisible(true);
                  await completeTask({ variables: { groupId, userId } });
                }}
                style={{ backgroundColor: 'lightpink' }}
              >
                <Text large>COMPLETE FOR TODAY</Text>
              </Button>
            </Buttons>
          </View>
        </Container>
      </SafeAreaView>
    );
  }
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  justify-content: center;
  padding: 0 5%;
  margin-bottom: 20px;
`;

const Header = styled.View`
  margin-top: 20px;
  justify-content: center;
  align-items: center;
`;

const Info = styled.View`
  flex: 1;
  /* background-color: lightgray; */
  margin: 20px 0;
`;

const InfoBox = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ivory;
  padding: 5px 50px;
  border: 1px solid lightgray;
  border-radius: 5px;
`;

const Players = styled.View`
  flex: 4;
  margin: 20px 0;
  padding-top: 10px;
  border-radius: 15px;
`;

const PlayerRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  justify-content: space-evenly;
  height: 30px;
`;

const PlayerCell = styled.Text`
  color: black;
  font-family: 'AvenirNext-Regular';
  width: 33%;
  padding: 5px;
  ${({ title, small, large }: any) => {
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

const Buttons = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const Text = styled.Text`
  color: ${(props: any) => (props.primary ? 'white' : 'black')};
  font-family: 'AvenirNext-Regular';

  ${({ title, small, large }: any) => {
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
  border-bottom-color: ${(props: any) => (props.primary ? 'darkgray' : 'white')};
  border-bottom-width: 2px;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  width: 90%;
  padding: 8px;
  background-color: lightskyblue;
  border-radius: 10px;
  margin: 5px 0;
`;

const EditButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  width: 90%;
  padding: 3px 10px;
  border: 1px solid dodgerblue;
  border-radius: 5px;
  margin: 5px 0;
  margin-right: 15px;
`;

const ModalView = styled.View`
  flex: 1;
  background-color: #000000aa;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.View`
  height: 400px;
  background-color: white;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  margin: 10px;
  border-radius: 10px;
`;

const ModalButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  padding: 8px 20px;
  margin-top: 20px;
  background-color: lightskyblue;
  border-radius: 5px;
`;

const InputGroup = styled.View`
  padding: 0px 50px;
  margin: 10px 50px;
  align-items: center;
`;

const InputStyled = styled.TextInput`
  font-size: 18px;
`;

export default GroupDashboard;
