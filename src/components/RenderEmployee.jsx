import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RenderEmployee = ({ employee, onDelete, onEdit }) => {
  return (
    <View style={styles.employeeContainer}>
      <Text style={styles.employeeName}>{employee.nombre}</Text>
      <Text style={styles.employeeRole}>{employee.rol}</Text>
      <Text style={[styles.statusText, { color: employee.status ? 'green' : 'red' }]}>
        {employee.status ? 'Activo' : 'Inactivo'}
      </Text>

      <TouchableOpacity onPress={() => onEdit(employee)} style={styles.editButton}>
        <Ionicons name="pencil" size={24} color="orange" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(employee.id)} style={styles.deleteButton}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  employeeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 5,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  employeeRole: {
    fontSize: 14,
    color: '#666',
  },
  statusText: {
    fontSize: 14,
  },
  editButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
  },
});

export default RenderEmployee;