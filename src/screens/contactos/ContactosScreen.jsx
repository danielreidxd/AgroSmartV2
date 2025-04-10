import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function ContactosScreen({ navigation }) {
  const [contactos, setContactos] = useState([
    { id: '1', name: 'Juan Pérez', phone: '1234567890' },
    { id: '2', name: 'María López', phone: '0987654321' },
  ]);

  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedContacto, setSelectedContacto] = useState(null);
  const [contactoName, setContactoName] = useState('');
  const [contactoPhone, setContactoPhone] = useState('');

  const openEditModal = (contacto) => {
    setSelectedContacto(contacto);
    setContactoName(contacto.name);
    setContactoPhone(contacto.phone);
    setEditModalVisible(true);
  };

  const saveEditContacto = () => {
    setContactos((prevContactos) =>
      prevContactos.map((contacto) =>
        contacto.id === selectedContacto.id
          ? { ...contacto, name: contactoName, phone: contactoPhone }
          : contacto
      )
    );
    setEditModalVisible(false);
  };

  const openAddModal = () => {
    setContactoName('');
    setContactoPhone('');
    setRegisterModalVisible(true);
  };

  const addContacto = () => {
    const newContacto = {
      id: (contactos.length + 1).toString(),
      name: contactoName,
      phone: contactoPhone,
    };
    setContactos((prevContactos) => [...prevContactos, newContacto]);
    setRegisterModalVisible(false);
  };

  const callContact = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      Alert.alert('Error', 'No se pudo realizar la llamada.')
    );
  };

  const renderContacto = ({ item }) => (
    <View style={styles.contactoItem}>
      <Ionicons name="person-circle" size={40} color="#a9a9a9" />
      <View style={styles.contactoInfo}>
        <Text style={styles.contactoName}>{item.name}</Text>
        <Text style={styles.contactoPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => openEditModal(item)}
      >
        <Ionicons name="pencil" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.callButton}
        onPress={() => callContact(item.phone)}
      >
        <Ionicons name="call" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Contactos</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add-circle" size={30} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={contactos}
        renderItem={renderContacto}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contactoList}
      />

      <TouchableOpacity
        style={styles.phoneContactsButton}
        onPress={() => navigation.navigate('ContactosDispositivo')}
      >
        <Ionicons name="book" size={24} color="#fff" />
        <Text style={styles.phoneContactsText}>Contactos del dispositivo</Text>
      </TouchableOpacity>

      {/* Modal para Registrar Contacto */}
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
            <Text style={styles.modalTitle}>Registrar Contacto</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del contacto"
              value={contactoName}
              onChangeText={setContactoName}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={contactoPhone}
              onChangeText={setContactoPhone}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.updateButton}
              onPress={addContacto}
            >
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

      {/* Modal para Editar Contacto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(!editModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Editar Contacto</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del contacto"
              value={contactoName}
              onChangeText={setContactoName}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={contactoPhone}
              onChangeText={setContactoPhone}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.updateButton}
              onPress={saveEditContacto}
            >
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
  contactoList: {
    paddingBottom: 20,
  },
  contactoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactoInfo: {
    marginLeft: 15,
    flex: 1,
  },
  contactoName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16, // Asegúrate de que el texto no sea demasiado grande
  },
  contactoPhone: {
    color: '#a9a9a9',
    fontSize: 14, // Asegúrate de que el texto no sea demasiado grande
  },
  editButton: {
    backgroundColor: '#6c5ce7',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  callButton: {
    backgroundColor: '#34c759',
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
  phoneContactsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c5ce7',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
  },
  phoneContactsText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default ContactosScreen;
