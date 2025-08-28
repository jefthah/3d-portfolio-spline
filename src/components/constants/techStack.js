// Kelompokkan per kategori
export const FRONTEND = [
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sass', label: 'Sass/SCSS' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'bootstrap', label: 'Bootstrap' },
];

export const BACKEND = [
  { value: 'nodejs', label: 'Node.js' },
  { value: 'express', label: 'Express.js' },
  { value: 'django', label: 'Django' },
  { value: 'flask', label: 'Flask' },
  { value: 'laravel', label: 'Laravel' },
  { value: 'spring', label: 'Spring Boot' },
  { value: 'fastapi', label: 'FastAPI' },
  { value: 'rails', label: 'Ruby on Rails' },
];

export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

export const DATABASES = [
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'redis', label: 'Redis' },
  { value: 'firebase', label: 'Firebase' },
  { value: 'supabase', label: 'Supabase' },
];

export const TOOLS = [
  { value: 'git', label: 'Git' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'aws', label: 'AWS' },
  { value: 'vercel', label: 'Vercel' },
  { value: 'netlify', label: 'Netlify' },
];

// Object berkelompok (enak buat render per section)
export const TECH_BY_CATEGORY = {
  Frontend: FRONTEND,
  Backend: BACKEND,
  Language: LANGUAGES,
  Database: DATABASES,
  Tools: TOOLS,
};

// Flatten untuk kebutuhan pencarian cepat / mapping badge
export const ALL_TECH_OPTIONS = Object.entries(TECH_BY_CATEGORY).flatMap(
  ([category, items]) => items.map((i) => ({ ...i, category }))
);
