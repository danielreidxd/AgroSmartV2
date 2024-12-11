// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import MenuPrincipalScreen from './screens/MenuPrincipalScreen';
import UserScreen from './screens/UserScreen';
import EmployeeScreen from './screens/EmployeeScreen';
import RanchosScreen from './screens/RanchosScreen';
import VehiculosScreen from './screens/VehiculosScreen'; 
import InventarioScreen from './screens/InventarioScreen';
import AsistenciaScreen from './screens/AsistenciaScreen';
import ContactosScreen from './screens/ContactosScreen';
import ContactosDispositivoScreen from './screens/ContactosDispositivoScreen';
import CortesScreen from './screens/CortesScreen';

// Creamos el Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MenuPrincipal" component={MenuPrincipalScreen} />
        <Stack.Screen name="Usuarios" component={UserScreen} />
        <Stack.Screen name="Empleados" component={EmployeeScreen} />
        <Stack.Screen name="Ranchos" component={RanchosScreen} />
        <Stack.Screen name="Vehiculos" component={VehiculosScreen} />
        <Stack.Screen name="Inventario" component={InventarioScreen} />
        <Stack.Screen name="Asistencia" component={AsistenciaScreen} />
        <Stack.Screen name="Contactos" component={ContactosScreen} />
        <Stack.Screen name="ContactosDispositivo" component={ContactosDispositivoScreen} />
        <Stack.Screen name="Cortes" component={CortesScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
