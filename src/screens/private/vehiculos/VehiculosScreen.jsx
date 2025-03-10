import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function VehiculosScreen({ navigation }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  // Campos del formulario
  const [vehiculoMarca, setVehiculoMarca] = useState('');
  const [vehiculoModelo, setVehiculoModelo] = useState('');
  const [vehiculoTipo, setVehiculoTipo] = useState('');
  const [vehiculoPlacas, setVehiculoPlacas] = useState('');
  const [vehiculoStatus, setVehiculoStatus] = useState(true); // Booleano para el estatus

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'vehicle'));
        const vehiculoData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVehiculos(vehiculoData);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehiculos();
  }, []);

  const addVehiculo = async () => {
    if (!vehiculoMarca || !vehiculoModelo || !vehiculoTipo || !vehiculoPlacas) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'vehicle'), {
        marca: vehiculoMarca,
        modelo: vehiculoModelo,
        tipo: vehiculoTipo,
        placas: vehiculoPlacas,
        status: vehiculoStatus,
      });
      setVehiculos(prev => [
        ...prev,
        { id: docRef.id, marca: vehiculoMarca, modelo: vehiculoModelo, tipo: vehiculoTipo, placas: vehiculoPlacas, status: vehiculoStatus },
      ]);
      Alert.alert('Éxito', 'Vehículo agregado correctamente.');
      setRegisterModalVisible(false);
      clearFormFields();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      Alert.alert('Error', 'No se pudo agregar el vehículo.');
    }
  };

  const saveEditVehiculo = async () => {
    if (!selectedVehiculo) return;

    try {
      await updateDoc(doc(db, 'vehicle', selectedVehiculo.id), {
        marca: vehiculoMarca,
        modelo: vehiculoModelo,
        tipo: vehiculoTipo,
        placas: vehiculoPlacas,
        status: vehiculoStatus,
      });
      setVehiculos(prev =>
        prev.map(vehiculo =>
          vehiculo.id === selectedVehiculo.id
            ? { ...selectedVehiculo, marca: vehiculoMarca, modelo: vehiculoModelo, tipo: vehiculoTipo, placas: vehiculoPlacas, status: vehiculoStatus }
            : vehiculo
        )
      );
      Alert.alert('Éxito', 'Vehículo actualizado correctamente.');
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      Alert.alert('Error', 'No se pudo actualizar el vehículo.');
    }
  };

  const deleteVehiculo = async id => {
    try {
      await deleteDoc(doc(db, 'vehicle', id));
      setVehiculos(prev => prev.filter(vehiculo => vehiculo.id !== id));
      Alert.alert('Éxito', 'Vehículo eliminado correctamente.');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      Alert.alert('Error', 'No se pudo eliminar el vehículo.');
    }
  };

  const clearFormFields = () => {
    setVehiculoMarca('');
    setVehiculoModelo('');
    setVehiculoTipo('');
    setVehiculoPlacas('');
    setVehiculoStatus(true);
  };

  const renderVehiculo = ({ item }) => (
    <View style={styles.vehiculoItem}>
      <Ionicons name="car" size={40} color="#a9a9a9" />
      <View style={styles.vehiculoInfo}>
        <Text style={styles.vehiculoName}>Marca: {item.marca}</Text>
        <Text style={styles.vehiculoDetails}>Modelo: {item.modelo}</Text>
        <Text style={styles.vehiculoDetails}>Tipo: {item.tipo}</Text>
        <Text style={styles.vehiculoDetails}>Placas: {item.placas}</Text>
        <Text style={styles.vehiculoStatus}>Estatus: {item.status ? 'Activo' : 'Inactivo'}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setSelectedVehiculo(item);
          setVehiculoMarca(item.marca);
          setVehiculoModelo(item.modelo);
          setVehiculoTipo(item.tipo);
          setVehiculoPlacas(item.placas);
          setVehiculoStatus(item.status);
          setEditModalVisible(true);
        }}
      >
        <Ionicons name="pencil" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteVehiculo(item.id)}
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
        <Text style={styles.title}>Vehículos</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setRegisterModalVisible(true)}>
          <Ionicons name="add-circle" size={30} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={vehiculos}
        renderItem={renderVehiculo}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.vehiculoList}
      />

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={registerModalVisible}
        onRequestClose={() => setRegisterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Registrar Vehículo</Text>
            <TextInput style={styles.input} placeholder="Marca" value={vehiculoMarca} onChangeText={setVehiculoMarca} />
            <TextInput style={styles.input} placeholder="Modelo" value={vehiculoModelo} onChangeText={setVehiculoModelo} />
            <TextInput style={styles.input} placeholder="Tipo" value={vehiculoTipo} onChangeText={setVehiculoTipo} />
            <TextInput style={styles.input} placeholder="Placas" value={vehiculoPlacas} onChangeText={setVehiculoPlacas} />
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Estatus:</Text>
              <TouchableOpacity
                style={[styles.statusButton, vehiculoStatus && styles.statusButtonActive]}
                onPress={() => setVehiculoStatus(true)}
              >
                <Text style={styles.statusButtonText}>Activo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, !vehiculoStatus && styles.statusButtonActive]}
                onPress={() => setVehiculoStatus(false)}
              >
                <Text style={styles.statusButtonText}>Inactivo</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.updateButton} onPress={addVehiculo}>
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

     
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Editar Vehículo</Text>
            <TextInput style={styles.input} placeholder="Marca" value={vehiculoMarca} onChangeText={setVehiculoMarca} />
            <TextInput style={styles.input} placeholder="Modelo" value={vehiculoModelo} onChangeText={setVehiculoModelo} />
            <TextInput style={styles.input} placeholder="Tipo" value={vehiculoTipo} onChangeText={setVehiculoTipo} />
            <TextInput style={styles.input} placeholder="Placas" value={vehiculoPlacas} onChangeText={setVehiculoPlacas} />
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Estatus:</Text>
              <TouchableOpacity
                style={[styles.statusButton, vehiculoStatus && styles.statusButtonActive]}
                onPress={() => setVehiculoStatus(true)}
              >
                <Text style={styles.statusButtonText}>Activo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, !vehiculoStatus && styles.statusButtonActive]}
                onPress={() => setVehiculoStatus(false)}
              >
                <Text style={styles.statusButtonText}>Inactivo</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.updateButton} onPress={saveEditVehiculo}>
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
  vehiculoList: {
    paddingBottom: 20,
  },
  vehiculoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  vehiculoInfo: {
    flex: 1,
  },
  vehiculoName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  vehiculoDetails: {
    color: '#a9a9a9',
  },
  vehiculoStatus: {
    color: '#fff',
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

export default VehiculosScreen;
