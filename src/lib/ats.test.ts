import { describe, it, expect } from "vitest";
import { analyze, buildResume } from "./ats";
const job = "Vaga: Desenvolvedor Full Stack\nRequisitos: React, Node.js, TypeScript, Full Stack, AWS";
const cv = "João Silva\nHabilidades\n- - - React, React, Node.js\n- TypeScript\nExperiência\n- - Dev na Empresa X";
describe("buildResume", () => {
  const out = buildResume(cv, analyze(job, cv), job);
  it("no repeated dashes", () => expect(out).not.toMatch(/- -/));
  it("no loose Full/Stack", () => { expect(out).not.toMatch(/, Full,|, Stack\b|- Full$/m); });
  it("no duplicate React", () => expect(out.match(/React/g)?.length).toBeLessThanOrEqual(2));
  it("summary has job title", () => expect(out).toMatch(/RESUMO PROFISSIONAL\n.*Desenvolvedor Full Stack.*React/));
});

describe("extração de termos", () => {
  const vaga = `Vaga: Desenvolvedora Full Stack Pleno
Requisitos Obrigatórios:
Domínio de React e TypeScript.
Vivência com Node.js, Docker e PostgreSQL.
Desejáveis
Next.js, Tailwind CSS, Jest, Git e Scrum. Experiência prática com AWS.`;
  const mariana = `Mariana Souza
Resumo
Desenvolvedora Full Stack com 5 anos usando React, TypeScript e Node.js.
Habilidades
React, TypeScript, Node.js, Docker, PostgreSQL, Next.js, Tailwind CSS, Jest, Git, Scrum
Experiência
- Dev na Empresa X: APIs em Node.js com PostgreSQL e Docker`;
  const kws = (job: string) => analyze(job, "").missing;
  it("termos individuais", () => {
    for (const t of ["React", "TypeScript", "Node.js", "Docker", "PostgreSQL", "Tailwind CSS", "Jest", "Git", "Scrum"]) expect(kws(vaga)).toContain(t);
  });
  it("não junta termos através de pontuação/linhas", () => {
    expect(kws(vaga).join("|")).not.toMatch(/TypeScript Dom|PostgreSQL Viv|Desej.veis Next/i);
  });
  it("sem stop words de título", () => {
    const l = kws(vaga).map((k) => k.toLowerCase());
    for (const w of ["desejáveis", "obrigatórios", "vivência", "domínio", "prática"]) expect(l).not.toContain(w);
  });
  it("score da Mariana entre 85 e 95", () => {
    const s = analyze(vaga, mariana).score;
    expect(s).toBeGreaterThanOrEqual(85);
    expect(s).toBeLessThanOrEqual(95);
  });
});
