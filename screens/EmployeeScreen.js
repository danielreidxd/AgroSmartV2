import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, storage } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

function EmployeeScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Campos del formulario
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRol, setEmployeeRol] = useState('');
  const [employeeStatus, setEmployeeStatus] = useState(true); // Booleano para el estatus
  const [employeePhoto, setEmployeePhoto] = useState(null); // URL de la foto

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'employee'));
        const employeeData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setEmployeePhoto(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!employeePhoto) return null;

    try {
      const response = await fetch(employeePhoto);
      const blob = await response.blob();
      const filename = `employees/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const addEmployee = async () => {
    if (!employeeName || !employeeRol) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const photoURL = await uploadImage();

    try {
      const docRef = await addDoc(collection(db, 'employee'), {
        nombre: employeeName,
        rol: employeeRol,
        status: employeeStatus,
        photoURL: photoURL || null,
      });
      setEmployees(prev => [
        ...prev,
        { id: docRef.id, nombre: employeeName, rol: employeeRol, status: employeeStatus, photoURL },
      ]);
      Alert.alert('Éxito', 'Empleado agregado correctamente.');
      setRegisterModalVisible(false);
      clearFormFields();
    } catch (error) {
      console.error('Error adding employee:', error);
      Alert.alert('Error', 'No se pudo agregar el empleado.');
    }
  };

  const saveEditEmployee = async () => {
    if (!selectedEmployee) return;

    const photoURL = await uploadImage();

    try {
      await updateDoc(doc(db, 'employee', selectedEmployee.id), {
        nombre: employeeName,
        rol: employeeRol,
        status: employeeStatus,
        photoURL: photoURL || selectedEmployee.photoURL,
      });
      setEmployees(prev =>
        prev.map(employee =>
          employee.id === selectedEmployee.id
            ? { ...selectedEmployee, nombre: employeeName, rol: employeeRol, status: employeeStatus, photoURL }
            : employee
        )
      );
      Alert.alert('Éxito', 'Empleado actualizado correctamente.');
      setEditModalVisible(false);
      clearFormFields();
    } catch (error) {
      console.error('Error updating employee:', error);
      Alert.alert('Error', 'No se pudo actualizar el empleado.');
    }
  };

  const deleteEmployee = async id => {
    try {
      await deleteDoc(doc(db, 'employee', id));
      setEmployees(prev => prev.filter(employee => employee.id !== id));
      Alert.alert('Éxito', 'Empleado eliminado correctamente.');
    } catch (error) {
      console.error('Error deleting employee:', error);
      Alert.alert('Error', 'No se pudo eliminar el empleado.');
    }
  };

  const clearFormFields = () => {
    setEmployeeName('');
    setEmployeeRol('');
    setEmployeeStatus(true);
    setEmployeePhoto(null);
  };

  const renderEmployee = ({ item }) => (
    <View style={styles.employeeItem}>
      {item.photoURL ? (
        <Image source={{ uri: item.photoURL }} style={styles.employeePhoto} />
      ) : (
        <Ionicons name="person-circle" size={40} color="#a9a9a9" />
      )}
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>Nombre: {item.nombre}</Text>
        <Text style={styles.employeeRol}>Rol: {item.rol}</Text>
        <Text style={styles.employeeStatus}>Estatus: {item.status ? 'Activo' : 'Inactivo'}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setSelectedEmployee(item);
          setEmployeeName(item.nombre);
          setEmployeeRol(item.rol);
          setEmployeeStatus(item.status);
          setEmployeePhoto(item.photoURL);
          setEditModalVisible(true);
        }}
      >
        <Ionicons name="pencil" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteEmployee(item.id)}
      >
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
        <Text style={styles.title}>Empleados</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setRegisterModalVisible(true)}>
          <Ionicons name="add-circle" size={30} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={employees}
        renderItem={renderEmployee}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.employeeList}
      />

      {/* Modal para Registrar Empleado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={registerModalVisible}
        onRequestClose={() => setRegisterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Registrar Empleado</Text>
            <TextInput style={styles.input} placeholder="Nombre" value={employeeName} onChangeText={setEmployeeName} />
            <TextInput style={styles.input} placeholder="Rol" value={employeeRol} onChangeText={setEmployeeRol} />
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Estatus:</Text>
              <TouchableOpacity
                style={[styles.statusButton, employeeStatus && styles.statusButtonActive]}
                onPress={() => setEmployeeStatus(true)}
              >
                <Text style={styles.statusButtonText}>Activo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, !employeeStatus && styles.statusButtonActive]}
                onPress={() => setEmployeeStatus(false)}
              >
                <Text style={styles.statusButtonText}>Inactivo</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Text style={styles.photoButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
            {employeePhoto && <Image source={{ uri: employeePhoto }} style={styles.previewPhoto} />}
            <TouchableOpacity style={styles.updateButton} onPress={addEmployee}>
              <Text style={styles.updateButtonText}>Agregar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.updateButton, styles.cancelButton]}
              onPress={() => setRegisterModalVisible(false)}
            >
              <Text style={styles.updateButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para Editar Empleado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Editar Empleado</Text>
            <TextInput style={styles.input} placeholder="Nombre" value={employeeName} onChangeText={setEmployeeName} />
            <TextInput style={styles.input} placeholder="Rol" value={employeeRol} onChangeText={setEmployeeRol} />
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Estatus:</Text>
              <TouchableOpacity
                style={[styles.statusButton, employeeStatus && styles.statusButtonActive]}
                onPress={() => setEmployeeStatus(true)}
              >
                <Text style={styles.statusButtonText}>Activo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, !employeeStatus && styles.statusButtonActive]}
                onPress={() => setEmployeeStatus(false)}
              >
                <Text style={styles.statusButtonText}>Inactivo</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Text style={styles.photoButtonText}>Actualizar Foto</Text>
            </TouchableOpacity>
            {employeePhoto && <Image source={{ uri: employeePhoto }} style={styles.previewPhoto} />}
            <TouchableOpacity style={styles.updateButton} onPress={saveEditEmployee}>
              <Text style={styles.updateButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.updateButton, styles.cancelButton]}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.updateButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginRight: 10,
  },
  employeeList: {
    paddingBottom: 20,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  employeeRol: {
    color: '#a9a9a9',
  },
  employeeStatus: {
    color: '#fff',
  },
  employeePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  modalContainer: {
    flex: 1,
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
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '100%',
  },
  statusText: {
    color: '#000',
    fontWeight: 'bold',
    marginRight: 10,
  },
  statusButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statusButtonActive: {
    backgroundColor: '#6c5ce7',
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  photoButton: {
    backgroundColor: '#6c5ce7',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewPhoto: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
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
  editButton: {
    backgroundColor: '#6c5ce7',
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    padding: 8,
    borderRadius: 5,
  },
});

export default EmployeeScreen;
