
import { SystemComponent, VerificationStep } from './types';

export const SYSTEM_COMPONENTS_DATA: SystemComponent[] = [
  {
    id: 'ag-ui',
    name: 'AG-UI Frontend',
    type: 'UI Frontend',
    status: 'Running',
    description: 'The user interface for interacting with the agent system. (This application)',
    port: 3000,
    relatedFiles: ['package.json', 'Dockerfile.agui (conceptual)'],
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    type: 'Orchestrator',
    status: 'Running',
    description: 'Manages and coordinates the different agents in the system.',
    port: 8000,
    path: '/orchestrator',
    dockerfile: 'Dockerfile.orchestrator',
    relatedFiles: ['orchestrator.py', 'requirements.txt'],
    configDetails: `
apiVersion: v1
kind: ConfigMap
metadata:
  name: recordlabel-config
data:
  LOG_LEVEL: "INFO"
  API_TIMEOUT: "30"
  # Add other common env vars here
`,
    deploymentDetails: `
# Dockerfile.orchestrator
FROM python:3.11-slim
WORKDIR /app
COPY orchestrator/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY orchestrator/ .
CMD ["python", "orchestrator.py"]

# k8s-deployments.yaml (snippet for orchestrator)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orchestrator
spec:
  replicas: 1
  selector:
    matchLabels:
      app: orchestrator
  template:
    metadata:
      labels:
        app: orchestrator
    spec:
      containers:
      - name: orchestrator
        image: yourrepo/recordlabel-orchestrator:latest # Replace with actual image
        ports:
        - containerPort: 8000
        env:
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: recordlabel-config
              key: LOG_LEVEL
        - name: DB_PASSWORD # Example, ensure secretKeyRef is used for real secrets
          valueFrom:
            secretKeyRef:
              name: recordlabel-secrets
              key: DB_PASSWORD
`
  },
  {
    id: 'mcp-server',
    name: 'MCP Server',
    type: 'MCP Server',
    status: 'Running',
    description: 'Master Control Program server, possibly for external integrations or core logic.',
    port: 9000,
    path: '/mcp',
    dockerfile: 'Dockerfile.mcp',
    relatedFiles: ['mcp_server.py', 'requirements.txt'],
  },
  {
    id: 'agents',
    name: 'Agent Services',
    type: 'Agent Group',
    status: 'Running',
    description: 'A collection of specialized agents performing various tasks.',
    agents: [
      { id: 'audio-analysis', name: 'Audio Analysis Agent', status: 'Running', description: 'Analyzes audio content.' },
      { id: 'metadata', name: 'Metadata Agent', status: 'Running', description: 'Manages metadata for tracks.' },
      { id: 'distribution', name: 'Distribution Agent', status: 'Running', description: 'Handles music distribution.' },
      { id: 'marketing', name: 'Marketing Agent', status: 'Pending', description: 'Manages marketing campaigns.' },
      { id: 'rights-licensing', name: 'Rights Licensing Agent', status: 'Error', description: 'Handles rights and licensing.' },
      { id: 'customer-support', name: 'Customer Support Agent', status: 'Stopped', description: 'Provides customer support functionalities.' },
      { id: 'analytics-reporting', name: 'Analytics Reporting Agent', status: 'Running', description: 'Generates analytics and reports.' },
    ],
    relatedFiles: [
      'Dockerfile.agent.audio_analysis', 
      'Dockerfile.agent.metadata', /* ... etc for all agents */
      'audio_analysis_agent.py', /* ... etc */
    ]
  },
];

export const K8S_SECRET_YAML = `
apiVersion: v1
kind: Secret
metadata:
  name: recordlabel-secrets
type: Opaque
stringData:
  DB_PASSWORD: "your_db_password_here" # Replace with actual provisioning
  API_KEY: "your_api_key_here"       # Replace with actual provisioning
  # Add other secrets here
`;

export const DOCKER_COMPOSE_YAML = \`
version: '3.9'

services:
  orchestrator:
    build:
      context: .
      dockerfile: Dockerfile.orchestrator
    ports:
      - "8000:8000"
    networks:
      - recordlabel_net

  audio_analysis_agent: # Example agent
    build:
      context: .
      dockerfile: Dockerfile.agent.audio_analysis
    networks:
      - recordlabel_net
  
  # ... (other agents defined similarly)

  mcp_server:
    build:
      context: .
      dockerfile: Dockerfile.mcp
    ports:
      - "9000:9000"
    networks:
      - recordlabel_net

  ag_ui: # This application
    build:
      context: . # Assuming Dockerfile.agui is present
      dockerfile: Dockerfile.agui 
    ports:
      - "3000:3000" 
    networks:
      - recordlabel_net

networks:
  recordlabel_net:
    driver: bridge
    # enable_ipv6: true # If needed
\`;

export const K8S_INGRESS_YAML = \`
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: recordlabel-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: / # Or specific per path
spec:
  rules:
  - host: recordlabel.example.com # Replace with actual host
    http:
      paths:
      - path: /orchestrator
        pathType: Prefix
        backend:
          service:
            name: orchestrator-service
            port:
              number: 8000
      - path: /mcp
        pathType: Prefix
        backend:
          service:
            name: mcp-server-service
            port:
              number: 9000
      - path: /ui
        pathType: Prefix
        backend:
          service:
            name: ag-ui-service # Service for this UI
            port:
              number: 3000 # Or 80 if served by a web server in container
\`;


export const VERIFICATION_STEPS_DATA: VerificationStep[] = [
  {
    id: 'local-dev',
    title: 'Local Development with Docker Compose',
    category: 'Local Docker Compose',
    details: 'Verify components running locally via Docker Compose.',
    subSteps: [
      { id: 'lc-build', text: \`Build and Start Containers: \\\`docker-compose up --build\\\`\` },
      { id: 'lc-agui', text: 'AG-UI Frontend accessible (usually http://localhost:3000)' },
      { id: 'lc-orchestrator', text: 'Orchestrator API accessible (e.g., http://localhost:8000/orchestrator)' },
      { id: 'lc-mcp', text: 'MCP Server API accessible (e.g., http://localhost:9000/mcp)' },
      { id: 'lc-agent-logs', text: \`Check agent container logs for errors: \\\`docker-compose logs <agent_service_name>\\\`\` },
    ],
  },
  {
    id: 'k8s-deploy',
    title: 'Cloud Deployment with Kubernetes',
    category: 'Kubernetes Cloud',
    details: 'Verify components deployed and accessible in Kubernetes.',
    subSteps: [
      { id: 'k8s-pods', text: 'Check Pod Status: All pods in "Running" state.', statusCommand: \`kubectl get pods\` },
      { id: 'k8s-services', text: 'Check Service Status: All services running with external IPs if applicable.', statusCommand: \`kubectl get services\` },
      { id: 'k8s-ingress', text: 'Check Ingress Status: Ingress configured correctly.', statusCommand: \`kubectl get ingress\` },
      { id: 'k8s-access-ui', text: 'Access AG-UI Frontend via Ingress host (e.g., http://recordlabel.example.com/ui)' },
      { id: 'k8s-access-orchestrator', text: 'Access Orchestrator API via Ingress host (e.g., http://recordlabel.example.com/orchestrator)' },
      { id: 'k8s-access-mcp', text: 'Access MCP Server API via Ingress host (e.g., http://recordlabel.example.com/mcp)' },
      { id: 'k8s-agent-logs', text: \`Check agent pod logs for communication issues: \\\`kubectl logs <pod_name>\\\`\` },
    ],
  },
];

export const DEPLOYMENT_COMMANDS = {
  title: "Key Deployment Commands",
  dockerCompose: [
    { command: "docker-compose up --build", description: "Builds images and starts all services defined in docker-compose.yml." },
    { command: "docker-compose down", description: "Stops and removes containers, networks, and volumes." },
    { command: "docker-compose ps", description: "Lists running services." },
    { command: "docker-compose logs -f <service_name>", description: "Follows logs for a specific service." }
  ],
  kubernetes: [
    { command: "kubectl apply -f k8s-configmap.yaml", description: "Applies the ConfigMap." },
    { command: "kubectl apply -f k8s-secret.yaml", description: "Applies the Secret (ensure it's created securely)." },
    { command: "kubectl apply -f k8s-deployments.yaml", description: "Deploys all components defined in the deployments file." },
    { command: "kubectl apply -f k8s-ingress.yaml", description: "Applies the Ingress rules." },
    { command: "kubectl get pods -w", description: "Watches pod status." },
    { command: "kubectl get services", description: "Lists all services in the current namespace." },
    { command: "kubectl get ingress", description: "Lists all ingresses in the current namespace." },
    { command: "kubectl logs <pod-name> [-c <container-name>]", description: "View logs for a specific pod/container." },
    { command: "kubectl describe pod <pod-name>", description: "Get detailed information about a pod, useful for troubleshooting." }
  ]
};
