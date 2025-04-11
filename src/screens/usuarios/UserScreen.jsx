import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUsers, registerUser, removeUser } from '../../controllers/UserController';
import RenderUser from '../../components/RenderUser';
import styles from './UserScreen.styles';

const UserScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
      console.log('Usuarios cargados:', usersData);
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchUsers);
    return unsubscribe;
  }, [navigation]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    try {
      await registerUser(formData.email, formData.password, formData.name);
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      setModalVisible(false);
      setFormData({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async (userId) => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: async () => {
          try {
            await removeUser(userId);
            Alert.alert('Éxito', 'Usuario eliminado');
            fetchUsers();
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header estilo empleados */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Usuarios</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Lista de usuarios */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6c5ce7" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RenderUser 
              user={item} 
              onDelete={handleDelete} 
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay usuarios registrados</Text>
          }
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      {/* Modal de registro */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Nuevo Usuario</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholderTextColor="#aaa"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#aaa"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Contraseña (mínimo 6 caracteres)"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry
              placeholderTextColor="#aaa"
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleRegister}
                disabled={!formData.name || !formData.email || !formData.password}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserScreen;