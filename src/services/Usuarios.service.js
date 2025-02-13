
export const getUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userList = [];
      querySnapshot.forEach((doc) => {
        userList.push({ id: doc.id, ...doc.data() });
      });
      return userList;
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los usuarios.');
    }
  };