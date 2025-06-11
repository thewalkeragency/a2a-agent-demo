import React, { useState } from 'react';
import { SYSTEM_COMPONENTS_DATA, K8S_SECRET_YAML, DOCKER_COMPOSE_YAML, K8S_INGRESS_YAML } from '../constants';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface ConfigSectionProps {
  title: string;
  yamlContent: string;
  defaultOpen?: boolean;
}

const ConfigSection: React.FC<ConfigSectionProps> = ({ title, yamlContent, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-neutral-dark shadow-md rounded-lg border border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-750 hover:bg-gray-700 transition-colors"
      >
        <h3 className="text-md font-semibold text-primary-light">{title}</h3>
        {isOpen ? <ChevronUpIcon className="w-5 h-5 text-gray-300" /> : <ChevronDownIcon className="w-5 h-5 text-gray-300" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-800 max-h-96 overflow-y-auto">
          <pre className="text-xs text-gray-200 whitespace-pre-wrap break-all">
            <code>{yamlContent.trim()}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

const ConfigurationPage: React.FC = () => {
  const orchestratorConfig = SYSTEM_COMPONENTS_DATA.find(c => c.id === 'orchestrator')?.configDetails;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-text-dark-primary mb-6">System Configuration Files</h2>
      
      {orchestratorConfig && (
        <ConfigSection title="Kubernetes ConfigMap (recordlabel-config)" yamlContent={orchestratorConfig} defaultOpen={true} />
      )}
      
      <ConfigSection title="Kubernetes Secret (recordlabel-secrets)" yamlContent={K8S_SECRET_YAML} />
      <ConfigSection title="Docker Compose (docker-compose.yml)" yamlContent={DOCKER_COMPOSE_YAML} />
      <ConfigSection title="Kubernetes Ingress (k8s-ingress.yaml)" yamlContent={K8S_INGRESS_YAML} />
      
      <div className="mt-8 p-4 bg-yellow-900/30 text-yellow-200 border border-yellow-700 rounded-md text-sm">
        <strong>Note:</strong> The YAML content displayed here is based on the examples provided in the project documentation. 
        Actual configurations, especially secrets and image URLs, should be managed securely and updated according to your deployment environment.
      </div>
    </div>
  );
};

export default ConfigurationPage;
