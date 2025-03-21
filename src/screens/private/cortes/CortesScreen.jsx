import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, storage } from '../../../../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

function CortesScreen({ navigation }) {
  const [cortes, setCortes] = useState([]);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCorte, setSelectedCorte] = useState(null);

  // Campos del formulario
  const [fecha, setFecha] = useState('');
  const [numeroCortadores, setNumeroCortadores] = useState('');
  const [cajasNecesarias, setCajasNecesarias] = useState('');
  const [encargado, setEncargado] = useState('');
  const [evidencia, setEvidencia] = useState(null);

  useEffect(() => {

    const fetchCortes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cortes'));
        const cortesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCortes(cortesData);
      } catch (error) {
        console.error('Error fetching cortes:', error);
      }
    };

    fetchCortes();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setEvidencia(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!evidencia) return null;

    try {
      const response = await fetch(evidencia);
      const blob = await response.blob();
      const filename = `cortes/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const addCorte = async () => {
    if (!fecha || !numeroCortadores || !cajasNecesarias || !encargado) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const photoURL = await uploadImage();

    try {
      const docRef = await addDoc(collection(db, 'cortes'), {
        fecha,
        numeroCortadores: parseInt(numeroCortadores),
        cajasNecesarias: parseInt(cajasNecesarias),
        encargado,
        evidencia: photoURL || null,
      });
      setCortes(prev => [
        ...prev,
        { id: docRef.id, fecha, numeroCortadores, cajasNecesarias, encargado, evidencia: photoURL },
      ]);
      Alert.alert('Éxito', 'Corte agregado correctamente.');
      setRegisterModalVisible(false);
      clearFormFields();
    } catch (error) {
      console.error('Error adding corte:', error);
      Alert.alert('Error', 'No se pudo agregar el corte.');
    }
  };

  const updateCorte = async () => {
    if (!selectedCorte) return;

    const photoURL = evidencia ? await uploadImage() : selectedCorte.evidencia;

    try {
      await updateDoc(doc(db, 'cortes', selectedCorte.id), {
        fecha,
        numeroCortadores: parseInt(numeroCortadores),
        cajasNecesarias: parseInt(cajasNecesarias),
        encargado,
        evidencia: photoURL,
      });
      setCortes(prev =>
        prev.map(corte =>
          corte.id === selectedCorte.id
            ? { id: selectedCorte.id, fecha, numeroCortadores, cajasNecesarias, encargado, evidencia: photoURL }
            : corte
        )
      );
      Alert.alert('Éxito', 'Corte actualizado correctamente.');
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating corte:', error);
      Alert.alert('Error', 'No se pudo actualizar el corte.');
    }
  };

  const deleteCorte = async id => {
    try {
      await deleteDoc(doc(db, 'cortes', id));
      setCortes(prev => prev.filter(corte => corte.id !== id));
      Alert.alert('Éxito', 'Corte eliminado correctamente.');
    } catch (error) {
      console.error('Error deleting corte:', error);
      Alert.alert('Error', 'No se pudo eliminar el corte.');
    }
  };

  const clearFormFields = () => {
    setFecha('');
    setNumeroCortadores('');
    setCajasNecesarias('');
    setEncargado('');
    setEvidencia(null);
  };

  const renderCorte = ({ item }) => (
    <View style={styles.corteItem}>
      {item.evidencia ? (
        <Image source={{ uri: item.evidencia }} style={styles.evidenciaImage} />
      ) : (
        <Ionicons name="image" size={40} color="#a9a9a9" />
      )}
      <View style={styles.corteInfo}>
        <Text style={styles.corteField}>Fecha: {item.fecha}</Text>
        <Text style={styles.corteField}>Cortadores: {item.numeroCortadores}</Text>
        <Text style={styles.corteField}>Cajas: {item.cajasNecesarias}</Text>
        <Text style={styles.corteField}>Encargado: {item.encargado}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setSelectedCorte(item);
          setFecha(item.fecha);
          setNumeroCortadores(item.numeroCortadores.toString());
          setCajasNecesarias(item.cajasNecesarias.toString());
          setEncargado(item.encargado);
          setEvidencia(item.evidencia);
          setEditModalVisible(true);
        }}
      >
        <Ionicons name="pencil" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCorte(item.id)}>
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
        <Text style={styles.title}>Cortes</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setRegisterModalVisible(true)}>
          <Ionicons name="add-circle" size={30} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cortes}
        renderItem={renderCorte}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.corteList}
      />

      {/* Modal para Registrar Corte */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={registerModalVisible}
        onRequestClose={() => setRegisterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Registrar Corte</Text>
            <TextInput style={styles.input} placeholder="Fecha" value={fecha} onChangeText={setFecha} />
            <TextInput
              style={styles.input}
              placeholder="Número de Cortadores"
              value={numeroCortadores}
              onChangeText={setNumeroCortadores}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Cajas Necesarias"
              value={cajasNecesarias}
              onChangeText={setCajasNecesarias}
              keyboardType="numeric"
            />
            <TextInput style={styles.input} placeholder="Encargado" value={encargado} onChangeText={setEncargado} />
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Text style={styles.photoButtonText}>Agregar Evidencia</Text>
            </TouchableOpacity>
            {evidencia && <Image source={{ uri: evidencia }} style={styles.previewPhoto} />}
            <TouchableOpacity style={styles.updateButton} onPress={addCorte}>
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

      {/* Modal para Editar Corte */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Editar Corte</Text>
            <TextInput style={styles.input} placeholder="Fecha" value={fecha} onChangeText={setFecha} />
            <TextInput
              style={styles.input}
              placeholder="Número de Cortadores"
              value={numeroCortadores}
              onChangeText={setNumeroCortadores}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Cajas Necesarias"
              value={cajasNecesarias}
              onChangeText={setCajasNecesarias}
              keyboardType="numeric"
            />
            <TextInput style={styles.input} placeholder="Encargado" value={encargado} onChangeText={setEncargado} />
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Text style={styles.photoButtonText}>Actualizar Evidencia</Text>
            </TouchableOpacity>
            {evidencia && <Image source={{ uri: evidencia }} style={styles.previewPhoto} />}
            <TouchableOpacity style={styles.updateButton} onPress={updateCorte}>
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
  corteList: {
    paddingBottom: 20,
  },
  corteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  evidenciaImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 15,
  },
  corteInfo: {
    flex: 1,
  },
  corteField: {
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
});

export default CortesScreen;
