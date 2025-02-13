import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { auth } from '../firebaseConfig'; // Importar la configuración de Firebase
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importar la función de autenticación de Firebase

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico y una contraseña.');
      return;
    }

    // Iniciar sesión con Firebase
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Inicio de sesión exitoso, navegar al menú principal
        navigation.navigate('MenuPrincipal');
      })
      .catch((error) => {
        // Mostrar un mensaje de error si ocurre un problema
        Alert.alert('Error al iniciar sesión', error.message);
      });
  };

  return (
    <View style={styles.container}>
      {/* Logo con restricciones de tamaño */}
      <Image source={require('../assets/logo.jpg')} style={styles.logo} />

      {/* Título */}
      <Text style={styles.title}>Inicia Sesión</Text>

      {/* Campo de Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#a9a9a9"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      {/* Campo de Contraseña */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#a9a9a9"
        secureTextEntry={true}
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      {/* Botón Iniciar Sesión */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    maxWidth: 150,
    maxHeight: 150,
    marginBottom: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#262626',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#6c5ce7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Login;
