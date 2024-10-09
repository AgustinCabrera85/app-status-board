import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from 'antd';
import EnvironmentStatus from '../components/EnvironmentStatus';
import BugNotification from '../components/BugNotification';

const { Header, Content } = Layout;

const FeaturePage = () => {
  const { featureId } = useParams();

  return (
    <Layout>
      <Header style={{ color: 'white', textAlign: 'center' }}>Feature Details</Header>
      <Content style={{ padding: '20px' }}>
        <h2>Feature ID: {featureId}</h2>
        <h3>Environment Status</h3>
        <EnvironmentStatus featureId={featureId} />
        <h3>Bug Notifications</h3>
        <BugNotification featureId={featureId} />
      </Content>
    </Layout>
  );
};

export default FeaturePage;
