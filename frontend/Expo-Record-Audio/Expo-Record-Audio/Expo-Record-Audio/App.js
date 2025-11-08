import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CountingNumbers from './pages/countingNumber'
import MakingSentance from './pages/MakingSentance'
import Home from './pages/Home'
import BottomBar from './Navigation/BottomBar'
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="BottomBar" component={BottomBar} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Counting Number" component={CountingNumbers} />
        <Stack.Screen name="Making Sentance" component={MakingSentance} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
