import React, { useState, useEffect } from 'react';
import { Table, Tag, Spin } from 'antd';
import { getApplicationsWithFeatures, getFeatureEnvironment, updateFeatureEnvironment } from '../services/api'; 
import StatusDropdown from './StatusDropdown';

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

const FeatureTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener las aplicaciones y features
  useEffect(() => {
    const fetchFeatures = async () => {
      setLoading(true);
      try {
        const applicationsData = await getApplicationsWithFeatures();
        const formattedData = formatDataForTable(applicationsData);
        setData(formattedData); // Asignamos los datos formateados a 'data'
      } catch (error) {
        console.error('Error fetching features:', error);
      }
      setLoading(false);
    };

    fetchFeatures();
  }, []);

  // Manejar la actualización de features en el backend y el frontend
  const handleStatusChange = async (appId, featureId, environment, newStatus) => {
    try {
      const featureEnvironment = await getFeatureEnvironment(featureId, environment);
      if (!featureEnvironment || !featureEnvironment.id) {
        throw new Error('No se encontró el ID de feature_environment');
      }

      // Actualizar los datos en el frontend inmediatamente
      setData((prevData) =>
        prevData.map((app) => {
          if (app.app_id === appId) {
            const updatedFeatures = app.features.map((feature) => {
              if (feature.feature_id === featureId) {
                return {
                  ...feature,
                  environments: {
                    ...feature.environments,
                    [environment]: {
                      ...feature.environments[environment],
                      health_status: newStatus,
                    },
                  },
                };
              }
              return feature;
            });

            return {
              ...app,
              features: updatedFeatures,
            };
          }
          return app;
        })
      );

      // Actualizar el estado en el backend usando el ID encontrado
      await updateFeatureEnvironment(featureEnvironment.id, newStatus);
      console.log(`Updated feature ${featureId} in ${environment} to ${newStatus}`);
    } catch (error) {
      console.error('Error updating feature status:', error);
    }
  };

  // Función para renderizar el estado de la lista desplegable
  const renderStatusSelect = (status, record, environment, appId) => {
    if (!record.feature_id) {
      return <Tag color={statusColor(status)}>{status || 'NA'}</Tag>;
    }

    const currentStatus = record.environments?.[environment]?.health_status || 'N/A'; // Leer correctamente el valor del backend

    return (
      <StatusDropdown
        status={currentStatus}
        onStatusChange={(newStatus) => handleStatusChange(appId, record.feature_id, environment, newStatus)}
      />
    );
  };

  // Refactorización de la función para formatear los datos correctamente
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
        DEV: feature.environments?.DEV?.health_status || 'N/A',
        QA: feature.environments?.QA?.health_status || 'N/A',
        SIT: feature.environments?.SIT?.health_status || 'N/A',
        UAT: feature.environments?.UAT?.health_status || 'N/A',
        PROD: feature.environments?.PROD?.health_status || 'N/A',
        environments: feature.environments, // Asegurarnos de que environments estén bien formateados
        app_id: app.app_id,
      })),
    }));
  };

  // Función para determinar el estado de la aplicación en función del estado de los features en un ambiente
  const aggregateEnvironmentStatus = (features, environment) => {
    const states = features.map((feature) => feature.environments?.[environment]?.health_status);
    if (states.every((state) => state === 'OK')) return 'OK';
    if ((states.some((state) => state === 'OK')) && (states.some((state)=> state === 'N/A')) && (!states.some((state)=> state === 'FAIL'))) return 'OK';
    if ((states.some((state) => state === 'OK')) && (states.some((state)=> state === 'N/A')) && (!states.some((state)=> state === 'Working with issues'))) return 'OK';
    if (states.some((state) => state === 'FAIL')) return 'FAIL';
    return 'Working with issues';
  };

  // Definir las columnas de la tabla
  const columns = [
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
      render: (status, record) => renderStatusSelect(status, record, 'DEV', record.app_id),
    },
    {
      title: 'QA',
      dataIndex: 'QA',
      key: 'QA',
      render: (status, record) => renderStatusSelect(status, record, 'QA', record.app_id),
    },
    {
      title: 'SIT',
      dataIndex: 'SIT',
      key: 'SIT',
      render: (status, record) => renderStatusSelect(status, record, 'SIT', record.app_id),
    },
    {
      title: 'UAT',
      dataIndex: 'UAT',
      key: 'UAT',
      render: (status, record) => renderStatusSelect(status, record, 'UAT', record.app_id),
    },
    {
      title: 'PROD',
      dataIndex: 'PROD',
      key: 'PROD',
      render: (status, record) => renderStatusSelect(status, record, 'PROD', record.app_id),
    },
  ];

  return (
    <div>
      <h2>Applications and Features by Environment</h2>
      {loading ? <Spin /> : <Table columns={columns} dataSource={data} pagination={false} />}
    </div>
  );
};

export default FeatureTable;
