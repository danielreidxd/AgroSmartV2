// src/controllers/EmployeeController.js
import { 
  fetchEmployeesFromDB,
  createEmployeeInDB,
  updateEmployeeInDB,
  deleteEmployeeFromDB
} from '../services/EmployeeService';

/**
 * Obtiene empleados con posible filtrado
 * @param {boolean} [activeOnly=false] - Solo empleados activos
 * @returns {Promise<Array>}
 */
export const getEmployees = async (activeOnly = false) => {
  try {
    const employees = await fetchEmployeesFromDB();
    return activeOnly ? employees.filter(e => e.status) : employees;
  } catch (error) {
    console.error('Controller Error - getEmployees:', error);
    throw new Error('Error al obtener empleados');
  }
};

/**
 * Valida y crea un empleado
 * @param {Object} employeeData 
 * @returns {Promise<Object>}
 */
export const createEmployee = async (employeeData) => {
  if (!employeeData.nombre || !employeeData.rol) {
    throw new Error('Nombre y rol son requeridos');
  }

  try {
    return await createEmployeeInDB({
      ...employeeData,
      status: employeeData.status ?? true
    });
  } catch (error) {
    console.error('Controller Error - createEmployee:', error);
    throw new Error('Error al crear empleado');
  }
};

/**
 * Actualiza un empleado con validación
 * @param {string} id 
 * @param {Object} updates 
 * @returns {Promise<void>}
 */
export const updateEmployee = async (id, updates) => {
  if (!id) throw new Error('ID de empleado requerido');
  
  try {
    await updateEmployeeInDB(id, updates);
  } catch (error) {
    console.error('Controller Error - updateEmployee:', error);
    throw new Error('Error al actualizar empleado');
  }
};

/**
 * Elimina un empleado
 * @param {string} id 
 * @returns {Promise<void>}
 */
export const deleteEmployee = async (id) => {
  if (!id) throw new Error('ID de empleado requerido');
  
  try {
    await deleteEmployeeFromDB(id);
  } catch (error) {
    console.error('Controller Error - deleteEmployee:', error);
    throw new Error('Error al eliminar empleado');
  }
};