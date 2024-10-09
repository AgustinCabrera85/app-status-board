import React from 'react';
import { Layout } from 'antd';
import ApplicationList from '../components/ApplicationList';
import FeatureList from '../components/FeatureList';

const { Header, Content } = Layout;

const Dashboard = () => {
  return (
    <Layout>
      <Header style={{ color: 'white', textAlign: 'center' }}>Dashboard</Header>
      <Content style={{ padding: '20px' }}>
        <h2>Applications Overview</h2>
        <ApplicationList />
        <h2>Features Overview</h2>
        <FeatureList />
      </Content>
    </Layout>
  );
};

export default Dashboard;
