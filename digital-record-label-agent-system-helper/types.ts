import React from 'react';

export type ComponentStatus = 'Running' | 'Stopped' | 'Error' | 'Building' | 'Not Deployed' | 'Pending' | 'Unknown';

export interface AgentDetail {
  id: string;
  name: string;
  status: ComponentStatus;
  description: string;
}

export interface SystemComponent {
  id: string;
  name: string;
  type: 'Orchestrator' | 'MCP Server' | 'Agent Group' | 'UI Frontend' | 'Agent';
  status: ComponentStatus;
  description: string;
  port?: number;
  path?: string;
  dockerfile?: string;
  relatedFiles?: string[];
  agents?: AgentDetail[]; // For Agent Group type
  configDetails?: string; // For config viewer
  deploymentDetails?: string; // For deployment guide
}

export interface VerificationStep {
  id: string;
  title: string;
  details: string;
  category: 'Local Docker Compose' | 'Kubernetes Cloud';
  subSteps?: VerificationSubStep[];
}

export interface VerificationSubStep {
  id: string;
  text: string;
  statusCommand?: string; // e.g. kubectl get pods
}

export interface NavItem {
  name: string;
  path: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>; // Changed from (props: React.SVGProps<SVGSVGElement>) => React.ReactNode
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  retrievedContext?: {
    uri?: string;
    title?: string;
  };
}
