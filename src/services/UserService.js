import { getDocs, collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db} from '../../firebaseConfig';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';

export const fetchUsersFromDB = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const userList = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      userList.push({
        id: doc.id,
        nombre: userData.nombre || 'Sin nombre',
        correo: userData.correo || 'Sin correo',
        createdAt: userData.createdAt?.toDate?.() || null,
        rol: userData.rol || 'usuario'
      });
    });
    
    console.log('Usuarios obtenidos de Firestore:', userList);
    return userList;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error; // Propaga el error para manejarlo en el controlador
  }
};

export const createUserInDB = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userDoc = {
      nombre: name,
      correo: email,
      createdAt: new Date(),
      rol: 'usuario'
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
    return { id: userCredential.user.uid, ...userDoc };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

export const deleteUserFromDB = async (userId) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    console.log('Usuario eliminado de Firestore:', userId);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};