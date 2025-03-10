import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

function RanchosScreen({ navigation }) {
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRancho, setSelectedRancho] = useState(null);
  const [ranchos, setRanchos] = useState([
    { id: '1', name: 'Agricola To', rfc: 'EXT990101NI1', direccion: 'Zamora', status: 'Inactivo', image: null },
    { id: '2', name: 'El Toro', rfc: 'EXT990101NI1', direccion: 'Tingüindín', status: 'Activo', image: null },
    { id: '3', name: 'Troje', rfc: 'EXT990101NI1', direccion: 'Tingüindín', status: 'Activo', image: null },
  ]);

  const [ranchoName, setRanchoName] = useState('');
  const [rfc, setRfc] = useState('');
  const [direccion, setDireccion] = useState('');
  const [status, setStatus] = useState('');

  const statusData = [
    { name: 'Activo', population: 2, color: '#00FF00', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Inactivo', population: 1, color: '#FF6347', legendFontColor: '#7F7F7F', legendFontSize: 12 },
  ];

  const addRancho = () => {
    const newRancho = {
      id: (ranchos.length + 1).toString(),
      name: ranchoName,
      rfc,
      direccion,
      status,
    };
    setRanchos([...ranchos, newRancho]);
    setRegisterModalVisible(false);
    setRanchoName('');
    setRfc('');
    setDireccion('');
    setStatus('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Ranchos</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setRegisterModalVisible(true)}>
          <Ionicons name="add-circle" size={30} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Estatus</Text>
        <PieChart
          data={statusData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[0, 0]}
          absolute
        />
      </View>

      <FlatList
        data={ranchos}
        renderItem={({ item }) => (
          <View style={styles.ranchoItem}>
            {item.image ? (
              <Image source={item.image} style={styles.ranchoImage} />
            ) : (
              <Ionicons name="home" size={40} color="#a9a9a9" />
            )}
            <View style={styles.ranchoInfo}>
              <Text style={styles.ranchoName}>{item.name}</Text>
              <Text style={styles.ranchoDetails}>RFC: {item.rfc}</Text>
              <Text style={styles.ranchoDetails}>Dirección: {item.direccion}</Text>
              <Text style={styles.ranchoStatus}>Estatus: {item.status}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setSelectedRancho(item);
                setEditModalVisible(true);
              }}
            >
              <Ionicons name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ranchoList}
      />

      {/* Modal para Registrar Nuevo Rancho */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={registerModalVisible}
        onRequestClose={() => {
          setRegisterModalVisible(!registerModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Registrar Nuevo Rancho</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del Rancho"
              value={ranchoName}
              onChangeText={setRanchoName}
            />
            <TextInput
              style={styles.input}
              placeholder="RFC"
              value={rfc}
              onChangeText={setRfc}
            />
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              value={direccion}
              onChangeText={setDireccion}
            />
            <TextInput
              style={styles.input}
              placeholder="Estatus (Activo/Inactivo)"
              value={status}
              onChangeText={setStatus}
            />

            <TouchableOpacity
              style={styles.updateButton}
              onPress={addRancho}
            >
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
      </Modal>
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientTo: "#08130D",
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

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
    marginRight: 10,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ranchoList: {
    paddingBottom: 20,
  },
  ranchoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  ranchoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  ranchoInfo: {
    flex: 1,
  },
  ranchoName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ranchoDetails: {
    color: '#a9a9a9',
    fontSize: 14,
  },
  ranchoStatus: {
    color: '#fff',
    fontSize: 14,
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

export default RanchosScreen;
