import React, { useEffect, useState } from 'react';
import { Table, Tag, Spin, Select } from 'antd';
import { getApplicationsWithFeatures, updateFeatureStatus } from '../services/api';

const { Option } = Select;

// Función para determinar el color del tag basado en el estado
const statusColor = (status) => {
  switch (status) {
    case 'OK':
      return 'green';
    case 'Working with issues':
      return 'orange';
    case 'FAIL':
      return 'red';
    default:
      return 'default';
  }
};

// Renderiza el `Select` solo si es un feature
const renderStatusSelect = (status, record, environment, setData, appId) => {
  if (!record.feature_id) {
    // Para aplicaciones, muestra solo el estado agregado sin permitir editar
    return <Tag color={statusColor(status)}>{status || 'N/A'}</Tag>;
  }

  // Para features, muestra un `Select` para permitir modificar el estado
  return (
    <Select
      value={status || 'N/A'}
      style={{ width: 120 }}
      onChange={(newStatus) => handleStatusChange(appId, record.feature_id, environment, newStatus, record, setData)}
    >
      <Option value="OK">OK</Option>
      <Option value="Working with issues">Working with issues</Option>
      <Option value="FAIL">FAIL</Option>
      <Option value={null}>N/A</Option>
    </Select>
  );
};

// Maneja el cambio de estado para las features
const handleStatusChange = async (appId, featureId, environment, newStatus, setData) => {
    if (!featureId) {
      console.error('Feature ID is undefined');
      return;
    }
  
    try {
      // Actualizamos el estado a través de la API
      const updatedApplication = await updateFeatureStatus(appId, featureId, environment, newStatus);
  
      // Función para actualizar el estado local del feature con los datos devueltos por la API
      setData((prevData) =>
          prevData.map((app) => {
            // Si la aplicación coincide con el appId
            if (app.app_id === appId) {
              // Iterar sobre los features de la aplicación para encontrar el feature correspondiente
              const updatedFeatures = app.features.map((feature) => {
                if (feature.feature_id === featureId) {
                  // Si el feature coincide con el featureId, actualizar solo el estado del ambiente correspondiente
                  return {
                    ...feature,
                    environments: {
                      ...feature.environments,
                      [environment]: {
                        ...feature.environments[environment],
                        health_status: newStatus,  // Actualizamos el health_status
                      },
                    },
                  };
                }
                return feature; // Si no es el feature que buscamos, lo dejamos intacto
              });
        
              // Retornar la aplicación con los features actualizados
              return {
                ...app,
                features: updatedFeatures,
              };
            }
            return app; // Si no es la aplicación que buscamos, la dejamos intacta
          })
        );
        
        console.log(`Updated feature ${featureId} in ${environment} to ${newStatus}`);
        
      } catch (error) {
        console.error('Error updating feature status:', error);
      }
    };

// Definición de las columnas de la tabla
const columns = (setData) => [
  {
    title: 'Application / Feature',
    dataIndex: 'application',
    key: 'application',
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: 'DEV',
    dataIndex: 'DEV',
    key: 'DEV',
    render: (status, record) => renderStatusSelect(status, record, 'DEV', setData, record.app_id),
  },
  {
    title: 'QA',
    dataIndex: 'QA',
    key: 'QA',
    render: (status, record) => renderStatusSelect(status, record, 'QA', setData, record.app_id),
  },
  {
    title: 'SIT',
    dataIndex: 'SIT',
    key: 'SIT',
    render: (status, record) => renderStatusSelect(status, record, 'SIT', setData, record.app_id),
  },
  {
    title: 'UAT',
    dataIndex: 'UAT',
    key: 'UAT',
    render: (status, record) => renderStatusSelect(status, record, 'UAT', setData, record.app_id),
  },
  {
    title: 'PROD',
    dataIndex: 'PROD',
    key: 'PROD',
    render: (status, record) => renderStatusSelect(status, record, 'PROD', setData, record.app_id),
  },
];

const FeatureTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeatures = async () => {
      setLoading(true);
      try {
        const applicationsData = await getApplicationsWithFeatures();
        const formattedData = formatDataForTable(applicationsData);
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching features:', error);
      }
      setLoading(false);
    };

    fetchFeatures();
  }, []);

  // Formatear los datos para que puedan ser usados en la tabla
  const formatDataForTable = (applications) => {
    return applications.map((app) => ({
      key: app.app_id,
      application: app.name,
      DEV: aggregateEnvironmentStatus(app.features, 'DEV'),
      QA: aggregateEnvironmentStatus(app.features, 'QA'),
      SIT: aggregateEnvironmentStatus(app.features, 'SIT'),
      UAT: aggregateEnvironmentStatus(app.features, 'UAT'),
      PROD: aggregateEnvironmentStatus(app.features, 'PROD'),
      children: app.features.map((feature) => ({
        key: feature.feature_id,
        feature_id: feature.feature_id,
        application: feature.name,
        DEV: feature.environments?.DEV?.health_status,
        QA: feature.environments?.QA?.health_status,
        SIT: feature.environments?.SIT?.health_status,
        UAT: feature.environments?.UAT?.health_status,
        PROD: feature.environments?.PROD?.health_status,
        environments: feature.environments,
        app_id: app.app_id,  // Pasamos app_id para poder usarlo en las funciones
      })),
    }));
  };

  // Función para determinar el estado de la aplicación en función del estado de los features en un ambiente
  const aggregateEnvironmentStatus = (features, environment) => {
    const states = features.map((feature) => feature.environments?.[environment]?.health_status);
    if (states.every((state) => state === 'OK')) return 'OK';
    if (states.some((state) => state === 'FAIL')) return 'FAIL';
    return 'Working with issues';
  };

  return (
    <div>
      <h2>Applications and Features by Environment</h2>
      {loading ? (
        <Spin />
      ) : (
        <Table columns={columns(setData)} dataSource={data} pagination={false} />
      )}
    </div>
  );
};

export default FeatureTable;
