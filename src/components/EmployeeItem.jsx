
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmployeeItem = ({ employee, onEdit, onDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemText}>{employee.nombre}</Text>
        <Text style={[styles.itemText, { fontSize: 14, opacity: 0.8 }]}>{employee.rol}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Ionicons name="pencil" size={20} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Ionicons name="trash" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  itemContainer: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
};

export default EmployeeItem;