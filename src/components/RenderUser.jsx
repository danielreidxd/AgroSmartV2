import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RenderUser = ({ user, onDelete }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user.nombre}</Text>
        <Text style={styles.email}>{user.correo}</Text>
        <Text style={styles.date}>
          Registrado el: {user.createdAt?.toLocaleDateString?.() || 'Fecha desconocida'}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => onDelete(user.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#ff4757" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  email: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  date: {
    color: '#666',
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
});

export default RenderUser;