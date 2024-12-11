import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function AsistenciaScreen({ navigation }) {
  const [empleados, setEmpleados] = useState([
    { id: '1', name: 'Carlos Hernández', role: 'Cortador', location: 'Zamora' },
    { id: '2', name: 'Ana López', role: 'Chofer', location: 'Zamora' },
    { id: '3', name: 'Jorge Martínez', role: 'Cortador', location: 'Zamora' },
  ]);

  const [asistenciaModalVisible, setAsistenciaModalVisible] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [cajasGrandes, setCajasGrandes] = useState('');
  const [cajasMedianas, setCajasMedianas] = useState('');
  const [cajasChicas, setCajasChicas] = useState('');
  const [fecha, setFecha] = useState('');
  const [asistio, setAsistio] = useState(false);

  const openAsistenciaModal = (empleado) => {
    setSelectedEmpleado(empleado);
    setCajasGrandes('');
    setCajasMedianas('');
    setCajasChicas('');
    setFecha('');
    setAsistio(false);
    setAsistenciaModalVisible(true);
  };

  const saveAsistencia = () => {
    console.log('Asistencia guardada para:', selectedEmpleado.name);
    console.log('Cajas Grandes:', cajasGrandes);
    console.log('Cajas Medianas:', cajasMedianas);
    console.log('Cajas Chicas:', cajasChicas);
    console.log('Fecha:', fecha);
    console.log('Asistió:', asistio);
    setAsistenciaModalVisible(false);
  };

  const renderEmpleado = ({ item }) => (
    <View style={styles.empleadoItem}>
      <Ionicons name="person-circle" size={40} color="#a9a9a9" />
      <View style={styles.empleadoInfo}>
        <Text style={styles.empleadoName}>{item.name}</Text>
        <Text style={styles.empleadoRole}>{item.role} - {item.location}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => openAsistenciaModal(item)}
      >
        <Ionicons name="clipboard" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Asistencia</Text>
      </View>

      <FlatList
        data={empleados}
        renderItem={renderEmpleado}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.empleadoList}
      />

      {/* Modal para Registrar Asistencia */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={asistenciaModalVisible}
        onRequestClose={() => {
          setAsistenciaModalVisible(!asistenciaModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Registrar Asistencia</Text>
            <Text style={styles.modalSubTitle}>Empleado: {selectedEmpleado?.name}</Text>

            <TextInput
              style={styles.input}
              placeholder="Fecha (DD/MM/AAAA)"
              value={fecha}
              onChangeText={setFecha}
            />
            <TextInput
              style={styles.input}
              placeholder="Cajas Grandes"
              value={cajasGrandes}
              onChangeText={setCajasGrandes}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Cajas Medianas"
              value={cajasMedianas}
              onChangeText={setCajasMedianas}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Cajas Chicas"
              value={cajasChicas}
              onChangeText={setCajasChicas}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAsistio(!asistio)}
            >
              <Ionicons
                name={asistio ? 'checkbox' : 'square-outline'}
                size={24}
                color="#6c5ce7"
              />
              <Text style={styles.checkboxLabel}>Asistió</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={saveAsistencia}
            >
              <Text style={styles.updateButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.updateButton, styles.cancelButton]}
              onPress={() => setAsistenciaModalVisible(false)}
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
  empleadoList: {
    paddingBottom: 20,
  },
  empleadoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  empleadoInfo: {
    marginLeft: 15,
    flex: 1,
  },
  empleadoName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empleadoRole: {
    color: '#a9a9a9',
  },
  editButton: {
    backgroundColor: '#6c5ce7',
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
    marginBottom: 10,
  },
  modalSubTitle: {
    fontSize: 16,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
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

export default AsistenciaScreen;
