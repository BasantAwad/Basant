export const capabilities = {
  languages: ['Python', 'Java', 'SQL', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'PHP', 'HTML', 'CSS'],
  backend: ['REST APIs', 'GraphQL', 'WebSockets', 'OpenAPI', 'Microservices', 'Django', 'NestJS', 'Node.js'],
  databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
  messaging: ['Apache Kafka', 'RabbitMQ'],
  cloudDevOps: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Prometheus', 'Grafana', 'Linux', 'AWS'],
  aiData: ['Machine Learning', 'Reinforcement Learning', 'Time-Series Forecasting', 'LLM Integration', 'RAG', 'Prompt Engineering', 'Embeddings', 'Scikit-learn', 'Hugging Face', 'Apache Airflow'],
  frontendTesting: ['React', 'Next.js', 'Tailwind CSS', 'PyTest', 'JUnit', 'Postman', 'k6'],
  methodologies: ['Agile', 'Scrum', 'Kanban', 'SOLID', 'Design Patterns', 'Clean Architecture', 'Domain-Driven Design', 'Event-Driven Architecture', 'Data Structures', 'Algorithms', 'Object-Oriented Programming', 'System Design', 'Distributed Systems', 'Problem Solving'],
};

export const capabilitySections = [
  { id: 'languages', label: 'Languages', icon: 'leaf' },
  { id: 'backend', label: 'Backend & APIs', icon: 'stem' },
  { id: 'databases', label: 'Databases', icon: 'leaf' },
  { id: 'messaging', label: 'Messaging & Streaming', icon: 'tendril' },
  { id: 'cloudDevOps', label: 'Cloud, DevOps & Infrastructure', icon: 'branch' },
  { id: 'aiData', label: 'AI & Data Science', icon: 'bud' },
  { id: 'frontendTesting', label: 'Frontend & Testing', icon: 'leaf' },
  { id: 'methodologies', label: 'Methodologies & Concepts', icon: 'root' },
];

export const capabilityAnchor = {
  languages:    0.60,
  backend:     0.62,
  databases:   0.64,
  messaging:   0.66,
  cloudDevOps: 0.68,
  aiData:      0.70,
  frontendTesting: 0.72,
  methodologies: 0.74,
};
