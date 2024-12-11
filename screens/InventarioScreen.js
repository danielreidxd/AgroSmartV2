import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function InventarioScreen({ navigation }) {
  const [productos, setProductos] = useState([
    { id: '1', name: 'Aguacate', status: 'Disponible', quantity: 100 },
    { id: '2', name: 'Zarzamora', status: 'Pocas Existencias', quantity: 20 },
  ]);

  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [productoName, setProductoName] = useState('');
  const [productoStatus, setProductoStatus] = useState('');
  const [productoQuantity, setProductoQuantity] = useState('');

  const openEditModal = (producto) => {
    setSelectedProducto(producto);
    setProductoName(producto.name);
    setProductoStatus(producto.status);
    setProductoQuantity(producto.quantity.toString());
    setEditModalVisible(true);
  };

  const saveEditProducto = () => {
    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto.id === selectedProducto.id
          ? { ...producto, name: productoName, status: productoStatus, quantity: parseInt(productoQuantity) }
          : producto
      )
    );
    setEditModalVisible(false);
  };

  const openAddModal = () => {
    setProductoName('');
    setProductoStatus('');
    setProductoQuantity('');
    setRegisterModalVisible(true);
  };

  const addProducto = () => {
    const newProducto = {
      id: (productos.length + 1).toString(),
      name: productoName,
      status: productoStatus,
      quantity: parseInt(productoQuantity),
    };
    setProductos((prevProductos) => [...prevProductos, newProducto]);
    setRegisterModalVisible(false);
  };

  const renderProducto = ({ item }) => (
    <View style={styles.productoItem}>
      <Ionicons name="leaf" size={40} color="#a9a9a9" />
      <View style={styles.productoInfo}>
        <Text style={styles.productoName}>{item.name}</Text>
        <Text style={styles.productoStatus}>Estatus: {item.status}</Text>
        <Text style={styles.productoQuantity}>Cantidad: {item.quantity}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => openEditModal(item)}
      >
        <Ionicons name="pencil" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Inventario</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add-circle" size={30} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={productos}
        renderItem={renderProducto}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productoList}
      />

      {/* Modal para Registrar Producto */}
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
            <Text style={styles.modalTitle}>Registrar Producto</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              value={productoName}
              onChangeText={setProductoName}
            />
            <TextInput
              style={styles.input}
              placeholder="Estatus del producto"
              value={productoStatus}
              onChangeText={setProductoStatus}
            />
            <TextInput
              style={styles.input}
              placeholder="Cantidad del producto"
              value={productoQuantity}
              onChangeText={setProductoQuantity}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.updateButton}
              onPress={addProducto}
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

      {/* Modal para Editar Producto */}
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
            <Text style={styles.modalTitle}>Editar Producto</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              value={productoName}
              onChangeText={setProductoName}
            />
            <TextInput
              style={styles.input}
              placeholder="Estatus del producto"
              value={productoStatus}
              onChangeText={setProductoStatus}
            />
            <TextInput
              style={styles.input}
              placeholder="Cantidad del producto"
              value={productoQuantity}
              onChangeText={setProductoQuantity}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.updateButton}
              onPress={saveEditProducto}
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
  productoList: {
    paddingBottom: 20,
  },
  productoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  productoInfo: {
    marginLeft: 15,
    flex: 1,
  },
  productoName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productoStatus: {
    color: '#a9a9a9',
  },
  productoQuantity: {
    color: '#fff',
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

export default InventarioScreen;
