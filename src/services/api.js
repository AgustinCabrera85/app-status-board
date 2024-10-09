import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Crea una instancia de Axios con la base URL configurada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener la lista de aplicaciones
export const getApplications = async () => {
  try {
    const response = await api.get('/applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

// Función para obtener los features
export const getFeatures = async () => {
  try {
    const response = await api.get('/features');
    return response.data;
  } catch (error) {
    console.error('Error fetching features:', error);
    throw error;
  }
};

// Función para obtener los estados de los features en los ambientes
export const getFeatureEnvironments = async () => {
  try {
    const response = await api.get('/feature_environments');
    return response.data;
  } catch (error) {
    console.error('Error fetching feature environments:', error);
    throw error;
  }
};

// Función para obtener aplicaciones con features y ambientes (unidos)
export const getApplicationsWithFeatures = async () => {
  try {
    // Obtener todas las aplicaciones
    const applications = await getApplications();

    // Obtener todos los features
    const features = await getFeatures();

    // Obtener los estados de los features en los ambientes
    const featureEnvironments = await getFeatureEnvironments();

    // Crear el formato de datos anidado como en la estructura anterior
    const formattedData = applications.map((app) => {
      const appFeatures = features
        .filter((feature) => feature.app_id === app.app_id)
        .map((feature) => {
          // Asociamos cada feature con sus estados en los diferentes ambientes
          const featureEnvs = featureEnvironments.filter(env => env.feature_id === feature.feature_id);

          // Creamos un objeto 'environments' que contiene los estados de los diferentes ambientes
          const environments = {
            DEV: featureEnvs.find(env => env.env_id === 'DEV')?.health_status || 'N/A',
            QA: featureEnvs.find(env => env.env_id === 'QA')?.health_status || 'N/A',
            SIT: featureEnvs.find(env => env.env_id === 'SIT')?.health_status || 'N/A',
            UAT: featureEnvs.find(env => env.env_id === 'UAT')?.health_status || 'N/A',
            PROD: featureEnvs.find(env => env.env_id === 'PROD')?.health_status || 'N/A',
          };

          return {
            ...feature,
            environments,  // Agregamos los ambientes y sus estados al feature
          };
        });

      return {
        ...app,
        features: appFeatures,
      };
    });

    return formattedData;
  } catch (error) {
    console.error('Error fetching applications with features:', error);
    throw error;
  }
};


// Función para actualizar el estado de un feature en un ambiente usando el ID del feature_environment
export const updateFeatureEnvironment = async (id, newStatus) => {
  try {
    // Hacer un PATCH directamente al recurso con el ID (id)
    const response = await api.patch(`/feature_environments/${id}`, {
      health_status: newStatus,
    });

    return response.data;
  } catch (error) {
    console.error('Error updating feature environment status:', error);
    throw error;
  }
};

// Obtener la relación feature_environment dado un feature_id y un env_id
export const getFeatureEnvironment = async (featureId, envId) => {
  try {
    const response = await api.get(`/feature_environments?feature_id=${featureId}&env_id=${envId}`);
    return response.data[0];  // Debería retornar el primer resultado que es la relación
  } catch (error) {
    console.error('Error fetching feature_environment:', error);
    throw error;
  }
};
