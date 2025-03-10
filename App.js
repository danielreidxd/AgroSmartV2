import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/public/Login.jsx';
import MenuPrincipalScreen from './src/screens/private/MenuPrincipalScreen.jsx';
import UserScreen from './src/screens/private/usuarios/UserScreen.jsx';
import EmployeeScreen from './src/screens/private/usuarios/UserScreen.jsx';
import RanchosScreen from './src/screens/private/ranchos/RanchosScreen.jsx';
import VehiculosScreen from './src/screens/private/vehiculos/VehiculosScreen.jsx'; 
import InventarioScreen from './src/screens/private/inventario/InventarioScreen.jsx';
import AsistenciaScreen from './src/screens/private/asistencias/AsistenciaScreen.jsx';
import ContactosScreen from './src/screens/private/contactos/ContactosScreen.jsx';
import ContactosDispositivoScreen from './src/screens/private/contactos/ContactosDispositivoScreen.jsx';
import CortesScreen from './src/screens/private/cortes/CortesScreen.jsx';

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
