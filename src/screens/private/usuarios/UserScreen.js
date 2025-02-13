import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import  Usuario from "../../../models/Usuario.model.ts"
import { getUsers } from '../../../services/Usuarios.service.js';

function UserScreen({ navigation }) {
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [users, setUsers] = useState<Usuario>([]);

  useEffect(() => {
    setUsers = getUsers();
  }, []);


  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        nombre: name,
        correo: email,
        createdAt: new Date(),
      });

      Alert.alert('Éxito', 'Usuario registrado con éxito');
      setRegisterModalVisible(false);
      setEmail('');
      setPassword('');
      setName('');
      fetchUsers(); // Actualiza la lista de usuarios
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      // Eliminar de Firestore
      await deleteDoc(doc(db, 'users', userId));

      // Opcional: Eliminar de Firebase Authentication
      const userToDelete = auth.currentUser;
      if (userToDelete && userToDelete.uid === userId) {
        await deleteUser(userToDelete);
      }

      Alert.alert('Éxito', 'Usuario eliminado correctamente');
      fetchUsers(); // Actualiza la lista de usuarios
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el usuario.');
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.nombre}</Text>
        <Text style={styles.userEmail}>{item.correo}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Usuarios</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setRegisterModalVisible(true)}>
          <Ionicons name="add-circle" size={30} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.userList}
      />

      {/* Modal para Registrar Usuario */}
      {registerModalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Registrar Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo Electrónico"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
            <TouchableOpacity style={styles.updateButton} onPress={handleRegister}>
              <Text style={styles.updateButtonText}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.updateButton, styles.cancelButton]}
              onPress={() => setRegisterModalVisible(false)}
            >
              <Text style={styles.updateButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    marginLeft: 'auto',
  },
  userList: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#a9a9a9',
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    padding: 8,
    borderRadius: 5,
  },
  modalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: '#6c5ce7',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#ff6347',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UserScreen;
