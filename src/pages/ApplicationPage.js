import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from 'antd';
import FeatureList from '../components/FeatureList';
import EnvironmentStatus from '../components/EnvironmentStatus';

const { Header, Content } = Layout;

const ApplicationPage = () => {
  const { appId } = useParams();

  return (
    <Layout>
      <Header style={{ color: 'white', textAlign: 'center' }}>Application Details</Header>
      <Content style={{ padding: '20px' }}>
        <h2>Application: {appId}</h2>
        <FeatureList />
        <h3>Environment Status for Features</h3>
        {/* Pasamos el featureId como ejemplo */}
        <EnvironmentStatus featureId="feat_001" />
      </Content>
    </Layout>
  );
};

export default ApplicationPage;

