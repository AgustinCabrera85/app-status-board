import axios from 'axios';

// Usa la constante API_URL para asegurar que todas las solicitudes vayan al puerto correcto
const API_URL = 'http://localhost:5000';

// Crea una instancia de Axios con la base URL configurada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener la lista de aplicaciones con sus features y ambientes
export const getApplicationsWithFeatures = async () => {
  try {
    // Obtener todas las aplicaciones con sus features anidadas
    const response = await api.get('/applications');
    return response.data;
  } catch (error) {
    console.error("Error fetching applications with features:", error);
    throw error;
  }
};

// Función para obtener los bugs asociados a un feature
export const getBugs = async (featureId) => {
  try {
    const response = await api.get(`/bugs?feature_id=${featureId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bugs for feature ${featureId}:`, error);
    throw error;  // Lanza el error para manejarlo en el componente
  }
};

// Función para convertir el nombre del ambiente en el env_id correspondiente
const getEnvIdFromEnvironment = (environment) => {
  const environmentMap = {
    "DEV": "env_001",
    "QA": "env_002",
    "SIT": "env_003",
    "UAT": "env_004",
    "PROD": "env_005"
  };
  return environmentMap[environment] || null;
};

// Función para actualizar solo el estado del ambiente de un feature específico en una aplicación
export const updateFeatureStatus = async (appId, featureId, environment, newStatus) => {
  try {
    // Obtener la aplicación con el app_id correcto
    const appResponse = await api.get(`/applications?app_id=${appId.trim()}`);
    const application = appResponse.data[0]; // Aseguramos que tomamos la primera aplicación que coincide

    if (!application) {
      throw new Error(`No se encontró la aplicación con app_id ${appId}`);
    }

    // Buscar el feature dentro de la aplicación
    const feature = application.features.find(f => f.feature_id === featureId);

    if (!feature) {
      throw new Error(`No se encontró el feature con ID ${featureId} en la aplicación ${appId}`);
    }

    // Actualizar solo el estado del ambiente en el feature
    feature.environments[environment].health_status = newStatus;

    // Hacer el PATCH con la aplicación completa actualizada
    const response = await api.patch(`/applications?app_id=${appId.trim()}`, {
      app_id: appId,
      features: application.features
    });

    return response.data;
  } catch (error) {
    console.error("Error updating feature status:", error);
    throw error;
  }
};





