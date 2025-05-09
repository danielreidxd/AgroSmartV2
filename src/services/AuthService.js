import { auth, db } from '../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

export const resetUserPassword = async (email) => {
  try {
    // Buscar el usuario por correo
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    let userDocId = null;

    snapshot.forEach((docSnap) => {
      if (docSnap.data().correo === email) {
        userDocId = docSnap.id;
      }
    });

    if (!userDocId) {
      throw new Error('No se encontró un usuario con ese correo');
    }

   
    await sendPasswordResetEmail(auth, email);
    console.log(`Se ha enviado un enlace de restablecimiento de contraseña a ${email}`);

    return `Se ha enviado un enlace para restablecer la contraseña a ${email}`;
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    throw error;
  }
};
