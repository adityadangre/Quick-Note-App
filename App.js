import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Intro from './app/screens/Intro';
import NoteScreen from './app/screens/NoteScreen'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import NoteDetail from './app/components/NoteDetail';
import NoteProvider from './app/contexts/NoteProvider';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState({})

  const [isAppFirstTimeOpen, setIsAppFirstTimeOpen] = useState(false)

  const renderNoteScreen = props => <NoteScreen {...props} user={user} />;

  const findUser = async () => {
    const result = await AsyncStorage.getItem('user')
    if(result === null) return setIsAppFirstTimeOpen(true)

      setUser(JSON.parse(result));
      setIsAppFirstTimeOpen(false)
  }

  useEffect(() => {
    findUser();
  }, [])

  if(isAppFirstTimeOpen) return <Intro onFinish={findUser} />
  return( <NavigationContainer>
  <NoteProvider>
    <Stack.Navigator
      screenOptions={{ headerTitle: '', headerTransparent: true }}
    >
      <Stack.Screen component={renderNoteScreen} name='NoteScreen' />
      <Stack.Screen component={NoteDetail} name='NoteDetail' />
    </Stack.Navigator>
    </NoteProvider>
</NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});