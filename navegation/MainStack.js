import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import InicioScreen from '../Screens/InicioScreen';
import { AccountScreen } from '../Screens/Account/AccountScreen';
import Registro from '../componentes/Registro';
import HomeScreen from '../Screens/HomeScreen';
import BusquedaScreen from '../Screens/BusquedaScreen';
import PublicacionBusqueda from '../Screens/PublicacionBusqueda';
import PublicacionDetalle from '../componentes/Busqueda/PublicacionDetalle';
import ParametrizacionScreen from '../Screens/ParametrizacionScreen';

const Stack = createNativeStackNavigator()

export default function MainStack() {
  return (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions = {{
              headerShown: false,
            }}
        >
            <Stack.Screen
                name='InicioScreen'
                component={InicioScreen}
            />
            <Stack.Screen
                name='AccountScreen'
                component={AccountScreen}
            />
            <Stack.Screen
                name='Registro'
                component={Registro}
            />
            <Stack.Screen
                name='HomeScreen'
                component={HomeScreen}
            />
            <Stack.Screen
                name='BusquedaScreen'
                component={BusquedaScreen}
            />  
            <Stack.Screen
                name='PublicacionBusqueda'
                component={PublicacionBusqueda}
            />         
            <Stack.Screen
                name='PublicacionDetalle'
                component={PublicacionDetalle}
            /> 
            <Stack.Screen
                name='ParametrizacionScreen'
                component={ParametrizacionScreen}
            /> 
        </Stack.Navigator>
    </NavigationContainer>
  )
}