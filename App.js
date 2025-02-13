// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/public/login';
import MenuPrincipalScreen from './src/screens/MenuPrincipalScreen';
import UserScreen from './src/private/screens/usuarios/UserScreen';
import EmployeeScreen from './src/private/screens/empleados/EmployeeScreen';
import RanchosScreen from './src/private/screens/ranchos/RanchosScreen';
import VehiculosScreen from './src/private/screens/vehiculos/VehiculosScreen'; 
import InventarioScreen from './src/private/screens/inventario/InventarioScreen';
import AsistenciaScreen from './src/private/screens/asistencias/AsistenciaScreen';
import ContactosScreen from './src/private/screens/contactos/ContactosScreen';
import ContactosDispositivoScreen from './src/private/screens/contactos/ContactosDispositivoScreen';
import CortesScreen from './src/private/screens/cortes/CortesScreen';

// Creamos el Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
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
