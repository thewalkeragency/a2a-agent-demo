
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './components/DashboardPage';
import VerificationPage from './components/VerificationPage';
import ConfigurationPage from './components/ConfigurationPage';
import DeploymentGuidePage from './components/DeploymentGuidePage';
import AiAssistantPage from './components/AiAssistantPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/configuration" element={<ConfigurationPage />} />
          <Route path="/deployment" element={<DeploymentGuidePage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;