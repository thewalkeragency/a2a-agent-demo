
import React, { useState } from 'react';
import { SystemComponent, AgentDetail, ComponentStatus } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface ComponentCardProps {
  component: SystemComponent;
}

const getStatusColor = (status: ComponentStatus): string => {
  switch (status) {
    case 'Running': return 'bg-green-500 text-green-50';
    case 'Stopped': return 'bg-red-500 text-red-50';
    case 'Error': return 'bg-yellow-500 text-yellow-900'; // Adjusted for better contrast with yellow-500
    case 'Building': return 'bg-blue-500 text-blue-50';
    case 'Pending': return 'bg-indigo-500 text-indigo-50';
    case 'Not Deployed': return 'bg-gray-500 text-gray-50';
    default: return 'bg-gray-400 text-gray-800'; // Default, consider contrast
  }
};

const ComponentCard: React.FC<ComponentCardProps> = ({ component }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderAgentDetails = (agents: AgentDetail[] | undefined) => {
    if (!agents || agents.length === 0) return null;
    return (
      <div className="mt-3 pt-3 border-t border-gray-600">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Individual Agents:</h4>
        <ul className="space-y-2">
          {agents.map(agent => (
            <li key={agent.id} className="flex justify-between items-center text-xs p-2 bg-gray-750 rounded">
              <span>{agent.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                {agent.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-neutral-dark shadow-lg rounded-lg p-4 border border-gray-700 hover:shadow-primary-dark/30 transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-primary-light">{component.name}</h3>
          <p className="text-xs text-gray-400 mb-1">{component.type}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(component.status)}`}>
          {component.status}
        </span>
      </div>
      <p className="text-sm text-gray-300 mt-2 mb-3">{component.description}</p>
      
      {(component.port || component.path || component.dockerfile || (component.relatedFiles && component.relatedFiles.length > 0) || component.agents) && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-primary-light hover:underline flex items-center mb-2"
        >
          {isExpanded ? 'Show Less' : 'Show More Details'}
          {isExpanded ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />}
        </button>
      )}

      {isExpanded && (
        <div className="text-xs text-gray-400 space-y-1 mt-2">
          {component.port && <p><strong>Port:</strong> {component.port}</p>}
          {component.path && <p><strong>Path:</strong> {component.path}</p>}
          {component.dockerfile && <p><strong>Dockerfile:</strong> {component.dockerfile}</p>}
          {component.relatedFiles && component.relatedFiles.length > 0 && (
            <div>
              <strong>Related Files:</strong>
              <ul className="list-disc list-inside ml-4">
                {component.relatedFiles.map(file => <li key={file}>{file}</li>)}
              </ul>
            </div>
          )}
          {component.type === 'Agent Group' && renderAgentDetails(component.agents)}
        </div>
      )}
    </div>
  );
};

export default ComponentCard;