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
