import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';



const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Éxito', 'Se ha enviado un correo para restablecer tu contraseña.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      Alert.alert('Error al restablecer la contraseña', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
      <Text style={styles.instructions}>Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.</Text>

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#a9a9a9"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Enviar correo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    color: '#ccc',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#262626',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#6c5ce7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backText: {
    color: '#74b9ff',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ForgotPassword;
