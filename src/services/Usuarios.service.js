import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';  // La ruta es relativa al archivo donde haces la importación

export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const userList = [];
    querySnapshot.forEach((doc) => {
      userList.push({ id: doc.id, ...doc.data() });
    });
    console.log('Usuarios obtenidos:', userList);  // Verifica si los usuarios son correctos
    return userList;
  } catch (error) {
    Alert.alert('Error', 'No se pudieron cargar los usuarios.');
    console.error('Error al obtener usuarios:', error);
  }
};

