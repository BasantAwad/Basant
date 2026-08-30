export const experience = [
  {
    id: 'biotatheca',
    type: 'experience',
    role: 'Full-Stack Software Engineer Intern',
    organization: 'Bibliotheca Alexandrina',
    location: 'Alexandria, Egypt',
    dates: 'July 2025 – August 2025',
    milestones: [
      {
        challenge: 'Research publication platform required a structured backend for metadata, archives, and secure access.',
        solution: 'Architected a Django and PostgreSQL backend for a research publication platform, automating metadata harvesting and archiving workflows for more than 200 researchers.',
        outcome: 'Designed and built secure RESTful APIs with JWT authentication and rate limiting. Integrated NLP-based search to improve document discovery.',
      },
    ],
    species: 'Hellebore',
    specimen: 'NB-021',
  },
  {
    id: 'iti',
    type: 'experience',
    role: 'Backend Developer Intern',
    organization: 'Information Technology Institute (ITI)',
    location: 'Al Alamein, Egypt',
    dates: 'July 2024 – August 2024',
    milestones: [
      {
        challenge: 'Real-time chat application required efficient message routing and concurrent client support.',
        solution: 'Developed a multithreaded Java TCP/IP chat application with JDBC persistence, applying efficient data structures for real-time message routing.',
        outcome: 'Supported concurrent client connections through a thread-safe communication architecture.',
      },
    ],
    species: 'Night-blooming cereus',
    specimen: 'NB-019',
  },
  {
    id: 'ta',
    type: 'teaching',
    role: 'Student Teaching Assistant',
    organization: 'Al Alamein International University',
    location: 'Al Alamein, Egypt',
    dates: 'September 2025 – June 2026',
    milestones: [
      {
        challenge: 'Students required practical guidance across OOP, data structures, and software engineering.',
        solution: 'Supported instruction in Object-Oriented Programming, Data Structures, and Software Engineering. Led practical laboratory sessions on SOLID principles, design patterns, clean architecture, and backend engineering.',
        outcome: 'Supported more than 50 students.',
      },
    ],
    species: 'Passionflower',
    specimen: 'NB-024',
  },
  {
    id: 'bianki',
    type: 'teaching',
    role: 'Technical Course Instructor',
    organization: 'Bianki Modern School',
    location: 'Alexandria, Egypt',
    dates: 'July 2025 – August 2025',
    milestones: [
      {
        challenge: 'Secondary-school students needed an accessible introduction to embedded logic and device communication.',
        solution: 'Taught hardware-software interfacing and embedded logic for IoT device communication.',
        outcome: null,
      },
    ],
    species: 'Chocolate cosmos',
    specimen: 'NB-022',
  },
  {
    id: 'icpc',
    type: 'leadership',
    role: 'Vice President',
    organization: 'AIU ICPC Community',
    location: 'Organizing Committee',
    dates: null,
    milestones: [
      {
        challenge: null,
        solution: 'Leadership and community role within the AIU ICPC Community organizing committee.',
        outcome: null,
      },
    ],
    species: 'Protea',
    specimen: 'NB-026',
  },
];

export const experienceTimeline = {
  rootStart: 0.02,
  rootEnd: 0.18,
  stemStart: 0.10,
  stemEnd: 0.55,
  leafStart: 0.18,
  leafEnd: 0.50,
  branchStart: 0.40,
  branchEnd: 0.85,
};
