import type { ResumeContent } from "@/lib/types";
import { CONTACT, SITE_URL } from "./identity";

export const RESUME_EN: ResumeContent = {
  name: "Jose Sleiter Rios",
  location: "Bucaramanga, Colombia (GMT-5)",
  locationLink: "https://www.google.com/maps/place/Bucaramanga",
  about: "Senior Software Engineer · Distributed Systems, Cloud & Full-Stack.",
  summary:
    "Senior Software Engineer with 8+ years of experience designing, scaling, and maintaining production-grade web applications and distributed cloud systems for companies across the US, LATAM, and Europe. Deep expertise in TypeScript, Python, React/Next.js, Node.js/NestJS, AWS/Azure, and event-driven architectures. Proven track record executing system migrations, reducing latency by 81%, designing multi-tenant schema-isolated databases, and enforcing robust CI/CD testing pipelines. Fluent in English (B2+ Professional Proficiency).",
  siteUrl: SITE_URL,
  contact: CONTACT,

  work: [
    {
      company: "Ozmoit",
      // TODO(sleiter): URL de la empresa
      title: "Senior Full-Stack Engineer",
      start: "Jan 2023",
      end: null,
      badges: [
        "Remote (Chile)",
        "TypeScript",
        "Python",
        "React",
        "Next.js",
        "Ruby on Rails",
        "PostgreSQL",
        "Redis",
        "Playwright",
        "Azure",
        "GitLab CI/CD",
      ],
      description:
        "Core engineer on the rewrite of a multi-tenant university management platform serving 50k+ active users.",
      highlights: [
        "System architecture & migration: moved legacy APIs to a modular Ruby on Rails 8 and Python microservices architecture with PostgreSQL and Redis.",
        "Database isolation: designed schema-per-tenant isolation in PostgreSQL driven by dynamic subdomain resolution, guaranteeing strict data privacy and zero cross-tenant leakage.",
        "Python automation: built internal Python microservices and CLI tools for high-volume student record processing, validation, and automated PDF document generation.",
        "Quality & CI/CD: engineered an E2E regression suite with ~400 Playwright flows integrated into GitLab CI / GitHub Actions as mandatory PR merge gates, sustaining 99.8% deployment reliability.",
      ],
    },
    {
      company: "Moonshot Partners",
      // TODO(sleiter): URL de la empresa
      title: "Senior Full-Stack Engineer",
      start: "Sep 2021",
      end: "Jan 2023",
      badges: [
        "Remote",
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Python",
        "AWS S3",
        "Azure Functions",
        "GitLab CI/CD",
      ],
      description:
        "Performance and serverless work on Go1's corporate e-learning partner platform.",
      highlights: [
        "Performance engineering: rebuilt the Go1 corporate e-learning partner portal in Next.js with Static Site Generation, cutting page load time from 8s to 1.5s (81% faster) and lifting the SEO score from 85 to 91.",
        "Serverless & cloud: architected serverless backend microservices on Azure Functions and AWS S3 using Python and Node.js for automated course content synchronization.",
      ],
    },
    {
      company: "TCIT Cloud Solutions",
      // TODO(sleiter): URL de la empresa
      title: "Full-Stack Engineer",
      start: "Mar 2021",
      end: "Aug 2021",
      badges: [
        "Remote (Chile)",
        "React",
        "Redux-Saga",
        "Node.js",
        "TypeScript",
        "MySQL",
        "Redis",
        "GitLab CD",
      ],
      description:
        "Mission-critical fleet management software for Carabineros de Chile.",
      highlights: [
        "Built a high-concurrency fleet management system to schedule repairs, track vehicle telemetry, and handle real-time incident reports.",
        "Implemented Redis caching layers and optimized MySQL queries, reducing API response latency by 35%.",
      ],
    },
    {
      company: "Grupo Hostienda S.L.",
      // TODO(sleiter): URL de la empresa
      title: "Software Engineer",
      start: "May 2018",
      end: "Feb 2021",
      badges: [
        "Remote (Spain)",
        "React",
        "Node.js",
        "Python (Flask)",
        "PostgreSQL",
        "GitLab CI/CD",
      ],
      description:
        "Custom order and inventory control platforms for multi-branch retail systems.",
      highlights: [
        "Designed order and inventory platforms for multi-branch retail in React and Node.js.",
        "Developed Python (Flask) background scripts and data processing tools for automated stock reconciliation across remote store locations.",
      ],
    },
    {
      company: "Plan Salud C.A. & client projects",
      // TODO(sleiter): URL (o quitar el enlace)
      title: "Distributed Systems Engineer",
      start: "Nov 2018",
      end: "Apr 2020",
      badges: [
        "Remote",
        "Python (Flask)",
        "Node.js",
        "Docker",
        "Kubernetes",
        "Kong Gateway",
        "RabbitMQ",
        "React",
        "Stripe",
      ],
      description:
        "Event-driven microservice platforms and high-concurrency booking systems.",
      highlights: [
        "Plan Salud C.A.: engineered an event-driven pharmaceutical inventory microservice platform using Python (Flask), Node.js, Docker, Kubernetes, Kong API Gateway, RabbitMQ, and the Saga pattern for transaction consistency.",
        "789.mx: developed a high-concurrency booking platform with Stripe payments and interactive seating maps in React and Node.js/Python, driving an 80% increase in revenue.",
      ],
    },
  ],

  education: [
    {
      school: "Universidad Católica Andrés Bello (UCAB)",
      degree: "B.Sc. in Computer Engineering (Ingeniero en Informática)",
      // TODO(sleiter): anos de inicio y egreso
    },
  ],

  skills: [
    "TypeScript",
    "Python",
    "JavaScript",
    "SQL",
    "Ruby",
    "Node.js",
    "NestJS",
    "Express",
    "Flask",
    "FastAPI",
    "React",
    "Next.js",
    "Redux",
    "React Native",
    "Vue.js",
    "Tailwind CSS",
    "Hotwire (Turbo/Stimulus)",
    "Ruby on Rails",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Azure Cosmos DB",
    "RabbitMQ",
    "Kong Gateway",
    "REST APIs",
    "GraphQL",
    "Microservices",
    "Event-driven architecture",
    "Multi-tenancy",
    "Clean Architecture",
    "System Design",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "GitHub Actions",
    "GitLab CI/CD",
    "Playwright",
  ],

  projects: [
    {
      title: "ai-cv-tailor",
      link: "https://github.com/JoseSleiter/ai-cv-tailor",
      techStack: ["TypeScript", "Next.js", "Claude Agent SDK", "Playwright"],
      description:
        "Local-first tool that tailors this CV to a specific job posting and drafts the application email. The AI never writes markup: it emits a validated typed object, checked by a guard that rejects invented companies, dates or skills.",
    },
    // TODO(sleiter): Pool Pass y lo que quieras sumar aca
  ],
};
