import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importar íconos

function MenuPrincipalScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Flecha de regreso personalizada */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.title, styles.menuTitle]}>Menú principal</Text>
      </View>
      <ScrollView contentContainerStyle={styles.menuContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Asistencia')}>
            <Image source={require('../assets/asistencia.jpg')} style={styles.image} />
            <Text style={styles.menuText}>Asistencia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Inventario')}>
            <Image source={require('../assets/inventario.jpg')} style={styles.image} />
            <Text style={styles.menuText}>Inventario</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Ranchos')}>
            <Image source={require('../assets/ranchos.jpg')} style={styles.image} />
            <Text style={styles.menuText}>Ranchos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Empleados')}>
            <Image source={require('../assets/empleados.jpg')} style={styles.image} />
            <Text style={styles.menuText}>Empleados</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Usuarios')}>
            <Image source={require('../assets/usuarios.jpg')} style={styles.image} />
            <Text style={styles.menuText}>Usuarios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Vehiculos')}>
            <Image source={require('../assets/vehiculos.jpg')} style={styles.image} />
            <Text style={styles.menuText}>Vehículos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Nominas')}>
            <Image source={require('../assets/nominas.jpg')} style={styles.image} />
            <Text style={styles.menuText}>Nóminas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Contactos')}>
            <Image source={require('../assets/contactos.jpg')} style={styles.image} />
            <Text style={styles.menuText}>Contactos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Cortes')}>
            <Image source={require('../assets/cortes.jpg')} style={styles.image} />
            <Text style={styles.menuText}>Cortes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuTitle: {
    marginLeft: 10, // Espacio para separar la flecha del título
  },
  menuContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20, // Ajuste para dar espacio a la cabecera
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  menuItem: {
    width: '45%',
    height: 150,
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  menuText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MenuPrincipalScreen;
