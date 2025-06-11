import React, { useState } from 'react';
import { SYSTEM_COMPONENTS_DATA, DEPLOYMENT_COMMANDS } from '../constants';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface CodeBlockProps {
  title: string;
  code: string;
  language?: string;
  defaultOpen?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ title, code, language = 'bash', defaultOpen = false }) => {
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
          <pre className={`language-${language} text-xs text-gray-200 whitespace-pre-wrap break-all`}>
            <code>{code.trim()}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

interface CommandListProps {
  title: string;
  commands: { command: string; description: string }[];
}

const CommandList: React.FC<CommandListProps> = ({ title, commands }) => (
  <div className="bg-neutral-dark shadow-md rounded-lg p-3 sm:p-6 border border-gray-700">
    <h3 className="text-lg font-semibold text-primary-light mb-4">{title}</h3>
    <ul className="space-y-3">
      {commands.map((cmd, index) => (
        <li key={index} className="p-3 bg-gray-750 rounded-md">
          <code className="block text-sm text-green-400 font-mono mb-1">{cmd.command}</code>
          <p className="text-xs text-gray-300">{cmd.description}</p>
        </li>
      ))}
    </ul>
  </div>
);


const DeploymentGuidePage: React.FC = () => {
  const orchestratorDeployment = SYSTEM_COMPONENTS_DATA.find(c => c.id === 'orchestrator')?.deploymentDetails;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-text-dark-primary mb-6">Deployment Guide & Snippets</h2>
      
      <CommandList title="Docker Compose Commands" commands={DEPLOYMENT_COMMANDS.dockerCompose} />
      <CommandList title="Kubernetes (kubectl) Commands" commands={DEPLOYMENT_COMMANDS.kubernetes} />

      {orchestratorDeployment && (
        <CodeBlock 
            title="Orchestrator Dockerfile & K8s Deployment Snippet" 
            code={orchestratorDeployment} 
            language="yaml"
            defaultOpen={true}
        />
      )}
      
      <div className="mt-8 p-4 bg-blue-900/30 text-blue-200 border border-blue-700 rounded-md text-sm">
        <strong>Tip:</strong> Always refer to the latest official documentation for Docker, Kubernetes, and any specific cloud provider instructions. 
        Replace placeholders like \`yourrepo/...\` with your actual registry paths and configurations.
      </div>
    </div>
  );
};

export default DeploymentGuidePage;
