import React, { useState, useEffect } from 'react';
import { FlatList, Modal, TextInput, Alert, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import RenderEmployee from '../../../components/RenderEmployee'; 
import { getEmployee, addEmployee, updateEmployee, deleteEmployee } from '../../../services/Employee.service.js'; 
import { Ionicons } from '@expo/vector-icons';

function EmployeeScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [registerModalVisible, setRegisterModalVisible] = useState(false); 
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');
  const [employeeStatus, setEmployeeStatus] = useState(true); 
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employees = await getEmployee();
        console.log('Employees:', employees); // Verifica que los datos se carguen correctamente
        setEmployees(employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployee();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id); // Elimina el empleado
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id)); // Actualiza la lista de empleados
      Alert.alert('Empleado eliminado', 'El empleado ha sido eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
      Alert.alert('Error', 'No se pudo eliminar el empleado. Inténtalo de nuevo.');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setEmployeeName(employee.nombre);
    setEmployeeRole(employee.rol);
    setEmployeeStatus(employee.status);
    setRegisterModalVisible(true); // Abre el modal
  };

  const handleSave = async () => {
    try {
      if (editingEmployee) {
        // Si se está editando un empleado, actualiza sus datos en Firebase
        await updateEmployee(editingEmployee.id, {
          nombre: employeeName,
          rol: employeeRole,
          status: employeeStatus,
        });

        // Actualiza la lista de empleados en el estado local
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.id === editingEmployee.id
              ? { ...emp, nombre: employeeName, rol: employeeRole, status: employeeStatus }
              : emp
          )
        );

        Alert.alert('Empleado actualizado', 'Los detalles del empleado han sido actualizados.');
      } else {
        // Si no se está editando, agrega un nuevo empleado a Firebase
        const newEmployee = {
          nombre: employeeName,
          rol: employeeRole,
          status: employeeStatus,
        };

        const docRef = await addEmployee(newEmployee);

        // Agrega el nuevo empleado a la lista
        setEmployees((prevEmployees) => [...prevEmployees, { id: docRef.id, ...newEmployee }]);

        Alert.alert('Empleado agregado', 'El nuevo empleado ha sido agregado.');
      }


      
      setRegisterModalVisible(false);
      setEmployeeName('');
      setEmployeeRole('');
      setEmployeeStatus(true);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error al guardar el empleado:', error);
      Alert.alert('Error', 'No se pudo guardar el empleado. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Empleados</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setRegisterModalVisible(true)}>
          <Ionicons name="add-circle" size={30} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RenderEmployee 
            employee={item} 
            onDelete={handleDelete} 
            onEdit={handleEdit} 
          />
        )}
      />

      {registerModalVisible && (
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingEmployee ? 'Editar Empleado' : 'Agregar Empleado'}
            </Text>

            {/* Campo para el nombre */}
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={employeeName}
              onChangeText={setEmployeeName}
            />

            {/* Campo para el rol */}
            <TextInput
              style={styles.input}
              placeholder="Rol"
              value={employeeRole}
              onChangeText={setEmployeeRole}
            />

            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Estado:</Text>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  employeeStatus ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => setEmployeeStatus(!employeeStatus)}
              >
                <Text style={styles.statusButtonText}>
                  {employeeStatus ? 'Activo' : 'Inactivo'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Botones de acción */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setRegisterModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
    width: '100%',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  statusButton: {
    padding: 8,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#2ecc71',
  },
  inactiveButton: {
    backgroundColor: '#e74c3c',
  },
  statusButtonText: {
    color: 'white',
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EmployeeScreen;