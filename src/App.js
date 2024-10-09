import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import FeatureTable from './components/FeatureTable';  // Actualiza la importación del componente FeatureTable
import { Provider } from 'react-redux';
import { store } from './store/store';

const { Header, Content } = Layout;

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Header style={{ color: 'white', textAlign: 'center' }}>
            Real-Time Feature Tracker
          </Header>
          <Content style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<FeatureTable />} />  {/* Actualiza la ruta para mostrar la tabla */}
            </Routes>
          </Content>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;
