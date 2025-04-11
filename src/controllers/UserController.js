import { fetchUsersFromDB, createUserInDB, deleteUserFromDB } from '../services/UserService';

export const getUsers = async () => {
    try {
      const users = await fetchUsersFromDB();
      if (users.length === 0) {
        console.log('La colección "users" existe pero está vacía');
      }
      return users;
    } catch (error) {
      console.error('Controller Error - getUsers:', error);
      throw new Error('No se pudieron cargar los usuarios. Verifica la conexión');
    }
  };
  
  export const registerUser = async (email, password, name) => {
    if (!email || !password || !name) {
      throw new Error('Todos los campos son requeridos');
    }
    
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
  
    try {
      return await createUserInDB(email, password, name);
    } catch (error) {
      console.error('Controller Error - registerUser:', error);
      throw new Error(error.message || 'Error al registrar usuario');
    }
  };
  
  export const removeUser = async (userId) => {
    if (!userId) {
      throw new Error('ID de usuario no proporcionado');
    }
  
    try {
      await deleteUserFromDB(userId);
    } catch (error) {
      console.error('Controller Error - removeUser:', error);
      throw new Error('No se pudo eliminar el usuario');
    }
  };