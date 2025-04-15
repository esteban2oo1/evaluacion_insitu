import api from './api';

// Ejemplo de función para obtener datos
export const getData = async () => {
  try {
    const response = await api.get('/endpoint');
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  }
};

// Ejemplo de función para enviar datos
export const postData = async (data: any) => {
  try {
    const response = await api.post('/endpoint', data);
    return response.data;
  } catch (error) {
    console.error('Error al enviar datos:', error);
    throw error;
  }
}; 