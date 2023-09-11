import {
    collection,
    addDoc,
    updateDoc,
    onSnapshot,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
  import { db } from './firebase.config';

  const taskCollectionName = "tasks";
  
  
  export const sendTaskToFirestore = async (task) => {
    try {
      // Agrega la tarea a Firebase Firestore.
      await addDoc(collection(db, taskCollectionName), task);
      console.log('Tarea enviada a Firestore exitosamente');
    } catch (error) {
      console.error('Error al enviar la tarea a Firestore:', error);
    }
  };

  export const getTasksForCurrentUser = async (uid) => {
  
    try {
      // Obtén el usuario autenticado actual
  
  
  
      // Crea una consulta para obtener las tareas del usuario actual
      const q = query(collection(db, taskCollectionName), where("uid", "==", uid));
  
      // Ejecuta la consulta
      const querySnapshot = await getDocs(q);
  
      // Crea un arreglo para almacenar las tareas
      const tasks = [];
  
      // Itera a través de los documentos y agrégalos al arreglo
      querySnapshot.forEach((doc) => {
        tasks.push({ ...doc.data(), id: doc.id });
      });
  
      return tasks;
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      return [];
    }
    
  };
  export const updateTaskInFirestore = async (task) => {
    try {
      // Actualiza la tarea en Firebase Firestore.
      const taskRef = doc(db, taskCollectionName, task.id);
      const updatedData = {
        content: task.content, // Cambia 'content' por el nombre de la propiedad que deseas actualizar.
        // Agrega otras propiedades que desees actualizar aquí.
      };
  
      await updateDoc(taskRef, updatedData);
      console.log('Tarea actualizada en Firestore exitosamente');
    } catch (error) {
      console.error('Error al actualizar la tarea en Firestore:', error);
    }
  };
  export const updateTaskColumnIdInFirestore = async (taskId, newColumnId) => {
    try {
      // Obtiene la referencia del documento de la tarea
      const taskRef = doc(db, taskCollectionName, taskId);
  
      // Actualiza solo el campo 'columnId'
      const updatedData = {
        columnId: newColumnId,
      };
  
      await updateDoc(taskRef, updatedData);
      console.log('ColumnId de la tarea actualizado en Firestore exitosamente');
    } catch (error) {
      console.error('Error al actualizar el ColumnId de la tarea en Firestore:', error);
    }
  };
  export const deleteTaskFromFirestore = async (taskId) => {
    try {
      // Obtiene la referencia del documento de la tarea
      const taskRef = doc(db, taskCollectionName, taskId);
  
      // Elimina el documento de la tarea
      await deleteDoc(taskRef);
      console.log('Tarea eliminada de Firestore exitosamente');
    } catch (error) {
      console.error('Error al eliminar la tarea de Firestore:', error);
    }
  };