import { db } from '../../firebaseConfig';  
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const getEmployee = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'employee'));
    const employeeList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return employeeList;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw new Error('No se pudieron obtener los empleados');
  }
};

export const addEmployee = async (employeeData) => {
  const { nombre, rol, status } = employeeData;

  try {
    const docRef = await addDoc(collection(db, 'employee'), {
      nombre,
      rol,
      status,
    });
    return { id: docRef.id, ...employeeData };
  } catch (error) {
    console.error('Error adding employee:', error);
    throw new Error('No se pudo agregar el empleado');
  }
};

export const updateEmployee = async (employeeId, employeeData) => {
  const { nombre, rol, status } = employeeData;

  try {
    await updateDoc(doc(db, 'employee', employeeId), {
      nombre,
      rol,
      status,
    });
    return { id: employeeId, ...employeeData };
  } catch (error) {
    console.error('Error updating employee:', error);
    throw new Error('No se pudo actualizar el empleado');
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    await deleteDoc(doc(db, 'employee', employeeId));
    return employeeId;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw new Error('No se pudo eliminar el empleado');
  }
};