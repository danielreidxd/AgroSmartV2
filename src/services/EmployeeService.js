// src/services/EmployeeService.js
import { db } from '../../firebaseConfig';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

const employeesRef = collection(db, 'employees');

/**
 * Obtiene todos los empleados de Firestore
 * @returns {Promise<Array>} Lista de empleados con sus datos
 */
export const fetchEmployeesFromDB = async () => {
  const snapshot = await getDocs(employeesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Crea un nuevo empleado en Firestore
 * @param {Object} employeeData - Datos del empleado
 * @returns {Promise<Object>} Empleado creado con ID
 */
export const createEmployeeInDB = async (employeeData) => {
  const docRef = await addDoc(employeesRef, {
    ...employeeData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return { id: docRef.id, ...employeeData };
};

/**
 * Actualiza un empleado existente
 * @param {string} id - ID del documento
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise<void>}
 */
export const updateEmployeeInDB = async (id, updates) => {
  await updateDoc(doc(db, 'employees', id), {
    ...updates,
    updatedAt: new Date()
  });
};

/**
 * Elimina un empleado de Firestore
 * @param {string} id - ID del documento
 * @returns {Promise<void>}
 */
export const deleteEmployeeFromDB = async (id) => {
  await deleteDoc(doc(db, 'employees', id));
};