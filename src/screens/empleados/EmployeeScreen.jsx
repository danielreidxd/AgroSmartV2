
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../controllers/EmployeeController';
import EmployeeItem from '../../components/EmployeeItem';
import styles from './EmployeeScreen.styles';

export default function EmployeeScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [form, setForm] = useState({ nombre: '', rol: '', status: true });

  // Cargar empleados
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setForm({
      nombre: employee.nombre,
      rol: employee.rol,
      status: employee.status
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      if (currentEmployee) {
        await updateEmployee(currentEmployee.id, form);
        Alert.alert('Éxito', 'Empleado actualizado');
      } else {
        await createEmployee(form);
        Alert.alert('Éxito', 'Empleado creado');
      }
      loadEmployees();
      closeModal();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      Alert.alert('Éxito', 'Empleado eliminado');
      loadEmployees();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentEmployee(null);
    setForm({ nombre: '', rol: '', status: true });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Empleados</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <EmployeeItem 
              employee={item} 
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay empleados registrados</Text>
          }
        />
      )}

      {/* Modal de formulario */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={form.nombre}
              onChangeText={text => handleFormChange('nombre', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Rol"
              value={form.rol}
              onChangeText={text => handleFormChange('rol', text)}
            />

            <TouchableOpacity
              style={[
                styles.statusButton,
                form.status ? styles.statusActive : styles.statusInactive
              ]}
              onPress={() => handleFormChange('status', !form.status)}
            >
              <Text style={styles.statusText}>
                {form.status ? 'Activo' : 'Inactivo'}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}