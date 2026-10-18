const STOP = new Set(
  "a o e é de da do das dos em no na nos nas um uma uns umas para por com sem sob sobre que se ou ao aos à às como mais menos muito ser ter estar sua seu suas seus nosso nossa nossos nossas você voce vocês nós eles elas ele ela isso este esta esse essa entre até também já não sim the and or of to in for with on at by an be is are as from will you your our we this that it vaga empresa área area atuar atuação trabalhar experiência experiencia conhecimento conhecimentos desejável desejavel desejáveis desejaveis requisitos requisito responsabilidades responsabilidade diferencial diferenciais buscamos profissional anos ano boa bom ótima forte fortes capacidade habilidade habilidades necessário necessária obrigatório obrigatória obrigatórios obrigatorios obrigatórias vivência vivencia domínio dominio prática pratica práticas praticas sólida sólido avançado intermediário básico noções familiaridade benefícios beneficios local modelo remoto híbrido presencial contratação clt pj salário oferecemos atividades principais etc".split(
    " ",
  ),
);

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/** Known technologies / methodologies, matched as whole individual terms. */
export const TECH_TERMS = [
  "React Native", "React", "Next.js", "Vue.js", "Angular", "Svelte", "TypeScript", "JavaScript", "Node.js", "Express", "NestJS",
  "Docker", "Kubernetes", "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQL", "NoSQL", "GraphQL", "REST",
  "Tailwind CSS", "CSS", "HTML", "Sass", "Jest", "Cypress", "Playwright", "Vitest", "Testing Library", "Git", "GitHub", "GitLab",
  "Scrum", "Kanban", "Agile", "CI/CD", "AWS", "Azure", "GCP", "Firebase", "Python", "Django", "Flask", "FastAPI", "Java",
  "Spring Boot", "Kotlin", "Swift", "Golang", "Rust", "C#", ".NET", "PHP", "Laravel", "Ruby on Rails", "Linux", "Terraform",
  "Figma", "Redux", "Zustand", "Webpack", "Vite", "Prisma", "Microsserviços", "Microservices", "TDD", "DevOps", "Power BI", "Excel",
  "Full Stack", "Front-end", "Back-end", "Jira",
];

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True if the text contains the term as an individual whole term. */
export const hasTerm = (text: string, term: string) =>
  new RegExp(`(^|[^a-z0-9+#])${escapeRe(norm(term))}(?![a-z0-9+#]|\\.[a-z])`).test(norm(text));

/** Split into segments that never cross line breaks or punctuation. */
function segments(text: string): string[] {
  return text.split(/\r?\n|[,;:()|•!?]|\.(?=\s|$)/).map((s) => s.trim()).filter(Boolean);
}

function tokens(seg: string): string[] {
  return (seg.match(/[A-Za-zÀ-ÿ0-9+#.\-/]+/g) || [])
    .map((t) => t.replace(/^[.\-/]+|[.\-/]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(norm(t)) && !/^\d+$/.test(t));
}

export function extractKeywords(job: string, max = 24): string[] {
  const out: string[] = [];
  const push = (w: string) => { if (!out.some((o) => norm(o) === norm(w))) out.push(w); };
  // 1. Known technologies, each as an individual term
  TECH_TERMS.filter((t) => hasTerm(job, t)).forEach(push);
  // 2. Other tech-looking tokens (Vue.js, C++, camelCase, ACRONYMS), always inside one segment
  const freq = new Map<string, { w: string; n: number }>();
  segments(job).forEach((seg) =>
    tokens(seg).forEach((t) => {
      const techy = /[+#]/.test(t) || /\.[a-z]/i.test(t) || /[a-z][A-Z]/.test(t) || /^[A-Z]{2,6}$/.test(t);
      if (!techy || out.some((o) => norm(o).split(/\s+/).includes(norm(t)))) return;
      const e = freq.get(norm(t));
      if (e) e.n++; else freq.set(norm(t), { w: t, n: 1 });
    }),
  );
  [...freq.values()].sort((a, b) => b.n - a.n).forEach((e) => push(e.w));
  return out.slice(0, max);
}

export interface Analysis {
  score: number;
  found: string[];
  missing: string[];
  strengths: string[];
  suggestions: string[];
}

export function analyze(job: string, resume: string): Analysis {
  const kws = extractKeywords(job);
  const found: string[] = [];
  const missing: string[] = [];
  kws.forEach((k) => (hasTerm(resume, k) ? found : missing).push(k));
  const score = kws.length ? Math.round((found.length / kws.length) * 100) : 0;
  const words = resume.trim().split(/\s+/).length;
  const hasNumbers = /\d+\s?%|\d{2,}/.test(resume);
  const strengths: string[] = [];
  const suggestions: string[] = [];
  if (found.length) strengths.push(`Você já menciona ${found.length} termo(s) relevante(s) da vaga, como ${found.slice(0, 3).join(", ")}.`);
  if (hasNumbers) strengths.push("Seu currículo traz números e resultados, o que reforça credibilidade.");
  if (/resumo|perfil|sobre/i.test(resume)) strengths.push("Há uma seção de resumo/perfil, facilitando a leitura rápida.");
  if (words > 150) strengths.push("O conteúdo tem profundidade suficiente para avaliação.");
  if (!strengths.length) strengths.push("Seu currículo tem uma base que pode ser alinhada à vaga.");
  if (missing.length) suggestions.push(`Se você realmente possui experiência com ${missing.slice(0, 4).join(", ")}, mencione esses termos de forma explícita.`);
  if (!hasNumbers) suggestions.push("Inclua resultados mensuráveis reais (%, prazos, volumes) nas suas experiências.");
  suggestions.push("Use títulos de seção padrão (Resumo, Habilidades, Experiência, Formação) para leitura ATS.");
  suggestions.push("Evite tabelas, colunas e imagens: sistemas ATS leem melhor texto simples.");
  if (words < 120) suggestions.push("Detalhe um pouco mais suas responsabilidades e conquistas reais.");
  return { score, found, missing, strengths, suggestions };
}

const SECTIONS: Record<string, RegExp> = {
  resumo: /^(resumo|perfil|sobre|objetivo|summary)/i,
  experiencia: /^(experi[eê]ncia|hist[oó]rico profissional|experience)/i,
  formacao: /^(forma[cç][aã]o|educa[cç][aã]o|escolaridade|education|cursos|certifica)/i,
  habilidades: /^(habilidades|compet[eê]ncias|skills|conhecimentos|tecnologias)/i,
};

const BULLET = /^[\s•●▪■◦*·\-–—]+/;
const ROLE = /(desenvolvedor|desenvolvedora|developer|engenheir[oa]|engineer|analista|analyst|gerente|manager|coordenador[a]?|designer|arquitet[oa]|especialista|consultor[a]?|assistente|t[eé]cnic[oa]|cientista|l[ií]der|lead|programador[a]?|product|scrum|devops|qa)\b/i;

export function detectJobTitle(job: string): string {
  const lines = job.split(/\r?\n/).map((l) => l.replace(BULLET, "").trim()).filter(Boolean);
  const explicit = job.match(/(?:cargo|vaga|posi[cç][aã]o|t[ií]tulo)\s*[:\-–]\s*([^\n]{3,80})/i);
  if (explicit?.[1]) return explicit[1].trim().replace(/[.;]+$/, "");
  const roleLine = lines.find((l) => l.length <= 80 && ROLE.test(l));
  if (roleLine) return roleLine.replace(/^(vaga( para| de)?|buscamos( um| uma)?|contratamos)\s*/i, "").replace(/[.:;]+$/, "").trim();
  return "";
}

const isTech = (s: string) => /[A-Z+#.]/.test(s) || /\d/.test(s);

export function cleanSkills(found: string[], existing: string[]): { tech: string[]; comp: string[] } {
  const all = [...found, ...existing]
    .map((s) => s.replace(BULLET, "").replace(/[.;:]+$/, "").trim())
    .filter((s) => s.length > 1 && s.length <= 40);
  const unique: string[] = [];
  for (const s of all) if (!unique.some((u) => norm(u) === norm(s))) unique.push(s);
  // Remove loose words that are part of a multi-word term (e.g. "Full", "Stack" when "Full Stack" exists)
  const multi = unique.filter((s) => s.includes(" ")).map((s) => norm(s).split(/\s+/));
  const filtered = unique.filter((s) => s.includes(" ") || !multi.some((parts) => parts.includes(norm(s))));
  return { tech: filtered.filter(isTech), comp: filtered.filter((s) => !isTech(s)) };
}

export function buildResume(resume: string, a: Analysis, job = ""): string {
  const lines = resume.split(/\r?\n/).map((l) => l.trim());
  type B = "header" | "resumo" | "experiencia" | "formacao" | "habilidades";
  const buckets: Record<B, string[]> = { header: [], resumo: [], experiencia: [], formacao: [], habilidades: [] };
  let cur: B = "header";
  for (const l of lines) {
    const clean = l.replace(BULLET, "").replace(/[:\-–]+$/, "").trim();
    const sec = Object.entries(SECTIONS).find(([, re]) => re.test(clean) && clean.length < 40);
    if (sec) { cur = sec[0] as B; continue; }
    if (!clean) continue;
    buckets[cur].push(BULLET.test(l) ? `- ${clean}` : clean);
  }
  if (!buckets.experiencia.length && !buckets.resumo.length && buckets.header.length > 3) {
    buckets.experiencia = buckets.header.slice(3);
    buckets.header = buckets.header.slice(0, 3);
  }
  const existing = buckets.habilidades.flatMap((l) => l.replace(BULLET, "").split(/[,;|•]/));
  const { tech, comp } = cleanSkills(a.found, existing);

  const title = detectJobTitle(job);
  const common = a.found.filter((f) => tech.includes(f)).slice(0, 5);
  const topTech = common.length ? common : a.found.slice(0, 5);
  const intro = `${title ? `Candidato(a) à posição de ${title}` : "Profissional"}${topTech.length ? `, com experiência prática em ${topTech.join(", ")}` : ""}.`;
  const original = buckets.resumo.map((l) => l.replace(BULLET, "")).join(" ").trim();
  const summary = original ? `${intro} ${original}` : intro;

  const section = (name: string, body: string[]) => [name, ...body].join("\n");
  const blocks: string[] = [];
  if (buckets.header.length) blocks.push(buckets.header.map((l) => l.replace(BULLET, "")).join("\n"));
  blocks.push(section("RESUMO PROFISSIONAL", [summary]));
  const skillBody: string[] = [];
  if (tech.length) skillBody.push(`- Tecnologias: ${tech.join(", ")}`);
  if (comp.length) skillBody.push(`- Competências: ${comp.join(", ")}`);
  if (skillBody.length) blocks.push(section("HABILIDADES RELEVANTES", skillBody));
  if (buckets.experiencia.length) blocks.push(section("EXPERIÊNCIA PROFISSIONAL", buckets.experiencia));
  if (buckets.formacao.length) blocks.push(section("FORMAÇÃO", buckets.formacao));
  return blocks.join("\n\n").trim();
}
