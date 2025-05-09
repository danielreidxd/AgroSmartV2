import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login.jsx';
import MenuPrincipalScreen from './src/screens/MenuPrincipalScreen.jsx';
import UserScreen from './src/screens/usuarios/UserScreen.jsx';
import EmployeeScreen from './src/screens/empleados/EmployeeScreen.jsx';
import RanchosScreen from './src/screens/ranchos/RanchosScreen.jsx';
import VehiculosScreen from './src/screens/vehiculos/VehiculosScreen.jsx'; 
import ContactosScreen from './src/screens/contactos/ContactosScreen.jsx';
import ContactosDispositivoScreen from './src/screens/contactos/ContactosDispositivoScreen.jsx';
import CortesScreen from './src/screens/cortes/CortesScreen.jsx';
import ForgotPasswordScreen from './src/screens/Auth/ForgotPasswordScreen.jsx';

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
        <Stack.Screen name="Contactos" component={ContactosScreen} />
        <Stack.Screen name="ContactosDispositivo" component={ContactosDispositivoScreen} />
        <Stack.Screen name="Cortes" component={CortesScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
