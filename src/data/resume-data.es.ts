import type { ResumeContent } from "@/lib/types";
import { CONTACT, SITE_URL } from "./identity";

export const RESUME_ES: ResumeContent = {
  name: "Jose Sleiter Rios",
  location: "Bucaramanga, Colombia (GMT-5)",
  locationLink: "https://www.google.com/maps/place/Bucaramanga",
  about:
    "Senior Software Engineer · 8+ años · Backend, full-stack y cloud · Disponible para nuevas oportunidades",
  summary:
    "Ingeniero de Software Senior con más de 8 años de experiencia diseñando, escalando y desplegando plataformas web y sistemas distribuidos en la nube para empresas de EE. UU., LATAM y Europa. Especialista en TypeScript, Python, React/Next.js, Node.js/NestJS, AWS/Azure y arquitecturas orientadas a eventos. Trayectoria demostrable ejecutando reescrituras de sistemas, reduciendo latencias en un 81%, diseñando bases de datos multi-tenant aisladas e integrando pipelines de pruebas automatizadas en CI/CD. Nivel de inglés fluido (B2+ Avanzado).",
  siteUrl: SITE_URL,
  contact: CONTACT,

  work: [
    {
      company: "Ozmo Global Services",
      title: "Ingeniero Full-Stack Senior",
      start: "Ene 2023",
      end: "Nov 2026",
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
        "Ingeniero principal en la reescritura de la plataforma universitaria que sostiene a +50k alumnos activos, reemplazando una API en NestJS y su back-office en React por un único sistema multi-institución en Ruby on Rails 8.",
      highlights: [
        "Arquitectura y migración: llevé las APIs legacy a una arquitectura modular en Rails 8 y microservicios en Python sobre PostgreSQL y Redis, preservando el comportamiento y midiéndolo contra una suite golden master de punta a punta, en vez de afirmarlo.",
        "Aislamiento por institución: diseñé la separación schema-per-tenant en PostgreSQL resuelta por subdominio y jamás por input del usuario, de modo que ninguna petición pueda alcanzar los datos de otra institución.",
        "Automatización en Python: microservicios internos y herramientas CLI para procesamiento masivo de datos académicos, validación y generación automatizada de PDF y documentos.",
        "Compuerta de calidad: ~400 flujos en Playwright integrados en GitLab CI / GitHub Actions como gate obligatorio de merge, manteniendo 99.8% de estabilidad en despliegues. Todo cambio pasa por revisión de pares.",
        "Entrega en paralelo: el trabajo se reparte en líneas aisladas —worktrees, bases de datos y puertos propios— para que varios ingenieros corran la suite completa a la vez sin pisarse.",
      ],
    },
    {
      company: "Moonshot Partners",
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
        "Ingeniería de rendimiento y serverless sobre la plataforma de socios de Go1, un marketplace de e-learning corporativo usado por equipos de formación de empresas.",
      highlights: [
        "Reconstruí el portal de socios de Go1 en Next.js con generación estática: el tiempo de carga bajó de 8 s a 1.5 s, un 81% más rápido, y el puntaje SEO subió de 85 a 91.",
        "Diseñé microservicios serverless en Azure Functions y AWS S3 con Python y Node.js para la sincronización automatizada del catálogo de cursos.",
      ],
    },
    {
      company: "TCIT Cloud Solutions",
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
        "Software crítico de gestión de flota para Carabineros de Chile, la policía nacional del país.",
      highlights: [
        "Construí una plataforma de alta concurrencia para programar mantenimientos, seguir la telemetría de los vehículos y atender reportes de incidencias en tiempo real.",
        "Reduje la latencia de respuesta de las APIs en un 35% con capas de caché en Redis y optimización de consultas en MySQL.",
      ],
    },
    {
      company: "Grupo Hostienda S.L.",
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
        "Casi tres años como ingeniero remoto de un grupo de retail multi-sucursal español, a cargo de punta a punta de sus sistemas de pedidos e inventario a medida.",
      highlights: [
        "Desarrollé plataformas a medida de gestión de pedidos e inventario multi-sucursal en React y Node.js.",
        "Creé procesos en Python (Flask) y herramientas de procesamiento de datos que conciliaban el stock automáticamente entre tiendas remotas.",
      ],
    },
    {
      company: "Freelance · proyectos de clientes",
      title: "Ingeniero de Sistemas Distribuidos y Full-Stack",
      start: "Nov 2018",
      end: "May 2020",
      badges: [
        "Remoto",
        "Python (Flask)",
        "Node.js",
        "Laravel",
        "React",
        "Vue.js",
        "Docker",
        "Kubernetes",
        "Kong Gateway",
        "RabbitMQ",
        "Stripe",
        "AWS",
      ],
      description:
        "Productos para clientes en Venezuela y México —desde una plataforma backend orientada a eventos hasta un motor de reservas con pagos—, cada uno entregado en solitario y en remoto.",
      highlights: [
        "Plan Salud C.A. — plataforma de inventario farmacéutico orientada a eventos: servicios en Python (Flask) y Node.js detrás de un gateway Kong, contenerizados con Docker y orquestados en Kubernetes, mensajería sobre RabbitMQ y patrón Saga para la consistencia transaccional entre servicios.",
        "789.mx (México) — motor de reservas de sesiones de spinning con pagos Stripe y mapa interactivo de asientos; backend en Laravel y Node.js, frontend en React y Vue.js. Generó un aumento del 80% en las ventas del cliente.",
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
    "Zustand",
    "Redux Toolkit",
    "TanStack Query",
    "Material UI",
    "Vue.js",
    "Laravel",
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
    "SSR / SSG / ISR",
    "Web Vitals",
    "Jest",
    "React Testing Library",
    "Cypress",
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
      title: "Pool Pass",
      link: "https://github.com/JoseSleiter/pool-pass",
      techStack: [
        "TypeScript",
        "Next.js",
        "React",
        "Supabase",
        "PostgreSQL",
        "Tailwind CSS",
        "Playwright",
      ],
      description:
        "PWA de reservas para un balneario en Venezuela: se reserva el pase del día, se paga con Pago Móvil C2P en bolívares al cambio oficial del BCV, llega un voucher con QR por correo y se escanea en la entrada. El cupo diario se bloquea dentro de una función de Postgres, así que dos personas no pueden llevarse el último lugar.",
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
      title: "Flujo de pedidos idempotente",
      link: "https://github.com/JoseSleiter/pedidos",
      techStack: ["TypeScript", "NestJS", "Prisma", "PostgreSQL", "Docker"],
      description:
        "Un flujo de pedidos construido alrededor de las tres cosas que se rompen con los reintentos: idempotencia, máquinas de estado y transiciones con compare-and-set. La misma Idempotency-Key devuelve el mismo pedido en vez de crear un segundo, y el stock se reserva con un UPDATE condicional, así que la carrera por la última unidad termina en un 201 y un 409.",
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
    {
      title: "Road Crossing (ensamblador MIPS)",
      link: "https://github.com/JoseSleiter/Road-Crossing-in-assember",
      techStack: ["MIPS Assembly", "MARS"],
      description:
        "Juego tipo Frogger escrito en ensamblador MIPS para el simulador MARS, dibujando sobre un bitmap mapeado en memoria y leyendo un teclado mapeado en memoria. Proyecto de la universidad, y el único código de esta lista que no tiene un framework debajo.",
    },
  ],
};
