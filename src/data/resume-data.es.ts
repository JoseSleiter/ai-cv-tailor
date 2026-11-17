import type { ResumeContent } from "@/lib/types";
import { CONTACT, SITE_URL } from "./identity";

export const RESUME_ES: ResumeContent = {
  name: "Jose Sleiter Rios",
  location: "Bucaramanga, Colombia (GMT-5)",
  locationLink: "https://www.google.com/maps/place/Bucaramanga",
  about:
    "Senior Software Engineer · Sistemas distribuidos, Cloud y Full-Stack.",
  summary:
    "Ingeniero de Software Senior con más de 8 años de experiencia diseñando, escalando y desplegando plataformas web y sistemas distribuidos en la nube para empresas de EE. UU., LATAM y Europa. Especialista en TypeScript, Python, React/Next.js, Node.js/NestJS, AWS/Azure y arquitecturas orientadas a eventos. Trayectoria demostrable ejecutando reescrituras de sistemas, reduciendo latencias en un 81%, diseñando bases de datos multi-tenant aisladas e integrando pipelines de pruebas automatizadas en CI/CD. Nivel de inglés fluido (B2+ Avanzado).",
  siteUrl: SITE_URL,
  contact: CONTACT,

  work: [
    {
      company: "Ozmoit",
      // TODO(sleiter): URL de la empresa
      title: "Ingeniero Full-Stack Senior",
      start: "Ene 2023",
      end: null,
      badges: [
        "Remoto (Chile)",
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
        "Ingeniero principal en la reescritura de una plataforma universitaria multi-institución para +50k usuarios activos.",
      highlights: [
        "Arquitectura y migración: llevé las APIs legacy a una arquitectura modular en Ruby on Rails 8 y microservicios en Python con PostgreSQL y Redis.",
        "Aislamiento de datos: diseñé el esquema de aislamiento multi-tenant en PostgreSQL resuelto por subdominio, garantizando privacidad total y eliminando fugas de datos entre instituciones.",
        "Automatización en Python: creé microservicios y herramientas CLI para procesamiento masivo de datos académicos, validación y generación automatizada de documentos en PDF.",
        "Calidad y CI/CD: construí una suite E2E con ~400 flujos en Playwright integrados en GitLab CI / GitHub Actions como compuertas obligatorias de merge, manteniendo 99.8% de estabilidad en despliegues.",
      ],
    },
    {
      company: "Moonshot Partners",
      // TODO(sleiter): URL de la empresa
      title: "Ingeniero Full-Stack Senior",
      start: "Sep 2021",
      end: "Ene 2023",
      badges: [
        "Remoto",
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
        "Rendimiento y serverless sobre la plataforma de e-learning corporativo de Go1.",
      highlights: [
        "Ingeniería de rendimiento: reconstruí el portal de socios de Go1 en Next.js con generación estática (SSG), reduciendo el tiempo de carga de 8 s a 1.5 s (81% más rápido) y subiendo el puntaje SEO de 85 a 91.",
        "Serverless y nube: diseñé microservicios serverless en Azure Functions y AWS S3 con Python y Node.js para sincronización automatizada de catálogos e-learning.",
      ],
    },
    {
      company: "TCIT Cloud Solutions",
      // TODO(sleiter): URL de la empresa
      title: "Ingeniero Full-Stack",
      start: "Mar 2021",
      end: "Ago 2021",
      badges: [
        "Remoto (Chile)",
        "React",
        "Redux-Saga",
        "Node.js",
        "TypeScript",
        "MySQL",
        "Redis",
        "GitLab CD",
      ],
      description:
        "Software crítico de gestión de flota para Carabineros de Chile.",
      highlights: [
        "Desarrollé una plataforma de alta concurrencia para la gestión de flota, optimizando la programación de mantenimientos y el seguimiento de incidencias en tiempo real.",
        "Implementé capas de caché en Redis y optimización de consultas en MySQL, reduciendo la latencia de respuesta de las APIs en un 35%.",
      ],
    },
    {
      company: "Grupo Hostienda S.L.",
      // TODO(sleiter): URL de la empresa
      title: "Ingeniero de Software",
      start: "May 2018",
      end: "Feb 2021",
      badges: [
        "Remoto (España)",
        "React",
        "Node.js",
        "Python (Flask)",
        "PostgreSQL",
        "GitLab CI/CD",
      ],
      description:
        "Plataformas a medida de gestión de inventario y pedidos multi-sucursal.",
      highlights: [
        "Desarrollé software a medida de gestión de inventario y pedidos multi-sucursal en React y Node.js.",
        "Creé scripts de automatización y herramientas internas en Python (Flask) para procesamiento de datos, lectura de archivos y conciliación de stock entre tiendas.",
      ],
    },
    {
      company: "Plan Salud C.A. y proyectos destacados",
      // TODO(sleiter): URL (o quitar el enlace)
      title: "Ingeniero de Sistemas Distribuidos",
      start: "Nov 2018",
      end: "Abr 2020",
      badges: [
        "Remoto",
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
        "Plataformas de microservicios orientadas a eventos y sistemas de reserva de alta concurrencia.",
      highlights: [
        "Plan Salud C.A.: diseñé la arquitectura de microservicios para control de stock farmacéutico con Python (Flask), Node.js, Docker, Kubernetes, Kong API Gateway, RabbitMQ y patrón Saga para consistencia transaccional.",
        "789.mx: construí el motor de reservas con pagos en Stripe y mapa interactivo de asientos en React y Node.js/Python, generando un aumento del 80% en ventas para el cliente.",
      ],
    },
  ],

  education: [
    {
      school: "Universidad Católica Andrés Bello (UCAB)",
      degree: "Ingeniero en Informática",
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
    "APIs REST",
    "GraphQL",
    "Microservicios",
    "Arquitectura orientada a eventos",
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
        "Herramienta local que adapta este mismo CV a una vacante concreta y redacta el correo de postulación. La IA nunca escribe markup: emite un objeto tipado validado, con una guarda que rechaza empresas, fechas o skills inventadas.",
    },
    {
      title: "API de OCR de facturas",
      link: "https://github.com/JoseSleiter/02-api-ocr",
      techStack: [
        "TypeScript",
        "NestJS",
        "AWS Textract",
        "Tesseract",
        "Docker",
        "Swagger",
      ],
      description:
        "Servicio en NestJS que recibe la foto de una factura y devuelve datos estructurados —fecha e importe total— interpretando el formato numérico según la región. Dos motores de OCR intercambiables detrás de una misma interfaz, AWS Textract y Tesseract local, para que el endpoint corra con o sin credenciales de nube.",
    },
    {
      title: "Encadenado de Lambdas con SNS",
      link: "https://github.com/JoseSleiter/serverless-sns",
      techStack: [
        "Node.js",
        "AWS Lambda",
        "Amazon SNS",
        "Serverless Framework",
      ],
      description:
        "Referencia mínima de fan-out en AWS: tres Lambdas encadenadas a través de un tópico SNS, declaradas de punta a punta en serverless.yml. Hecha para mostrar el patrón de desacople: cada función publica y se olvida, y el tópico se encarga del ruteo.",
    },
    {
      title: "Par de microservicios con RabbitMQ",
      link: "https://github.com/JoseSleiter/rabit-send",
      techStack: ["Node.js", "Express", "RabbitMQ", "MongoDB", "Docker"],
      description:
        "Los dos lados —productor y consumidor— de un microservicio de carrito dockerizado que se comunica por RabbitMQ (amqplib). Junto con rabit-receive es la versión más chica y ejecutable de la arquitectura orientada a eventos que llevé a producción en Plan Salud C.A.",
    },
  ],
};
