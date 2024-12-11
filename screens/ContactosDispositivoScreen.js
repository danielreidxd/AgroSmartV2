import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';

function ContactosDispositivoScreen({ navigation }) {
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        setContactos(data);
      } else {
        Alert.alert('Permiso denegado', 'No se pudo acceder a los contactos del dispositivo.');
      }
    };

    fetchContacts();
  }, []);

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
        {item.phoneNumbers && item.phoneNumbers.length > 0 ? (
          <Text style={styles.contactoPhone}>{item.phoneNumbers[0].number}</Text>
        ) : (
          <Text style={styles.contactoPhone}>No hay número disponible</Text>
        )}
      </View>
      {item.phoneNumbers && item.phoneNumbers.length > 0 && (
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => callContact(item.phoneNumbers[0].number)}
        >
          <Ionicons name="call" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Contactos del Dispositivo</Text>
      </View>

      <FlatList
        data={contactos}
        renderItem={renderContacto}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contactoList}
      />
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
  },
  contactoPhone: {
    color: '#a9a9a9',
  },
  callButton: {
    backgroundColor: '#34c759',
    padding: 8,
    borderRadius: 5,
  },
});

export default ContactosDispositivoScreen;
