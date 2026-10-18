import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, ArrowRight, ArrowLeft, Loader2, Copy, Check, Printer, RotateCcw, Sparkles, Lightbulb, FileText } from "lucide-react";
import { analyze, buildResume, type Analysis } from "@/lib/ats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATS Match — Otimize seu currículo para sistemas ATS" },
      { name: "description", content: "Compare seu currículo com a vaga, veja o match e gere uma versão ATS friendly sem inventar nada." },
      { property: "og:title", content: "ATS Match — Currículo ATS friendly" },
      { property: "og:description", content: "Análise de compatibilidade e currículo otimizado para ATS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const STEPS = ["Dados", "Diagnóstico", "Currículo ATS"];

function StepMap({ current }: { current: number }) {
  return (
    <nav aria-label="Etapas da análise" className="mx-auto mb-8 flex w-full items-center print:hidden">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${i <= current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i < current ? <Check className="h-4 w-4" /> : i + 1}</div>
          <span className={`hidden text-sm font-medium sm:inline ${i <= current ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
          {i < STEPS.length - 1 && <div className={`mx-3 h-0.5 min-w-6 flex-1 rounded ${i < current ? "bg-primary" : "bg-border"}`} />}
        </div>
      ))}
    </nav>
  );
}

function Index() {
  const [view, setView] = useState<"landing" | "wizard">("landing");
  const [step, setStep] = useState(0);
  const [url, setUrl] = useState("");
  const [job, setJob] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);
  const [copied, setCopied] = useState(false);
  const [bar, setBar] = useState(0);

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const r = analyze(job, resume);
      setResult(r);
      setLoading(false);
      setStep(1);
      setBar(0);
      setTimeout(() => setBar(r.score), 100);
    }, 900);
  };
  const reset = () => {
    setUrl(""); setJob(""); setResume(""); setResult(null); setStep(0); setView("landing"); setCopied(false);
  };
  const optimized = result ? buildResume(resume, result, job) : "";
  const copy = async () => {
    await navigator.clipboard.writeText(optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (view === "landing")
    return (
      <main className="min-h-screen bg-background px-5 py-14 md:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <StepMap current={-1} />
          <Badge variant="secondary" className="mt-12 gap-1 rounded-full px-3 py-1"><FileText className="h-3.5 w-3.5" /> ATS Match</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
            Otimize seu currículo para passar pelos filtros de sistemas <span className="text-primary">ATS</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Analisamos os requisitos da vaga e alinhamos seu currículo ao vocabulário certo, sem burocracia e em poucos segundos.
          </p>
          <Alert className="mt-10 max-w-xl rounded-xl border-primary/30 bg-accent text-left">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <AlertTitle>Compromisso ético</AlertTitle>
            <AlertDescription>Esta ferramenta melhora como você se apresenta e nunca inventa experiência que você não tem.</AlertDescription>
          </Alert>
          <Button size="lg" className="mt-10 h-12 rounded-xl px-8 text-base" onClick={() => setView("wizard")}>
            Começar Análise Agora <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <StepMap current={step} />

        {step === 0 && (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Insira os dados</CardTitle>
              <CardDescription>Cole a descrição da vaga e o texto do seu currículo atual.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Link da vaga <span className="text-muted-foreground">(opcional)</span></label>
                <Input placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição da vaga *</label>
                <Textarea className="min-h-48" placeholder="Cole aqui requisitos e responsabilidades..." value={job} onChange={(e) => setJob(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Seu currículo atual *</label>
                <Textarea className="min-h-64" placeholder="Cole aqui o texto completo do seu currículo..." value={resume} onChange={(e) => setResume(e.target.value)} />
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button variant="ghost" onClick={() => setView("landing")}><ArrowLeft className="mr-1 h-4 w-4" /> Início</Button>
                <Button size="lg" className="rounded-xl" disabled={!job.trim() || !resume.trim() || loading} onClick={run}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analisando...</> : "Analisar Compatibilidade"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 1 && result && (
          <div className="space-y-6">
            <Card className="rounded-xl">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground">Compatibilidade com a vaga</p>
                <p className="mt-1 text-5xl font-extrabold text-primary">{result.score}% <span className="text-xl font-semibold text-foreground">de Match</span></p>
                <Progress value={bar} className="mt-4 h-3 [&>div]:duration-1000" />
              </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="rounded-xl">
                <CardHeader><CardTitle className="text-base">Palavras-chave encontradas ({result.found.length})</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.found.length ? result.found.map((k) => <Badge key={k} className="border-transparent bg-success text-success-foreground hover:bg-success">{k}</Badge>) : <p className="text-sm text-muted-foreground">Nenhuma encontrada.</p>}
                </CardContent>
              </Card>
              <Card className="rounded-xl">
                <CardHeader><CardTitle className="text-base">Palavras-chave que faltam ({result.missing.length})</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.missing.length ? result.missing.map((k) => <Badge key={k} className="border-transparent bg-warning text-warning-foreground hover:bg-warning">{k}</Badge>) : <p className="text-sm text-muted-foreground">Nenhuma — ótimo!</p>}
                </CardContent>
              </Card>
              <Card className="rounded-xl">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" /> Pontos fortes</CardTitle></CardHeader>
                <CardContent><ul className="list-disc space-y-2 pl-5 text-sm">{result.strengths.map((s) => <li key={s}>{s}</li>)}</ul></CardContent>
              </Card>
              <Card className="rounded-xl">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Lightbulb className="h-4 w-4 text-primary" /> Sugestões práticas</CardTitle></CardHeader>
                <CardContent><ul className="list-disc space-y-2 pl-5 text-sm">{result.suggestions.map((s) => <li key={s}>{s}</li>)}</ul></CardContent>
              </Card>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button variant="outline" className="rounded-xl" onClick={() => setStep(0)}><ArrowLeft className="mr-1 h-4 w-4" /> Voltar e editar dados</Button>
              <Button size="lg" className="rounded-xl" onClick={() => setStep(2)}>Avançar para Versão ATS Friendly <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </div>
          </div>
        )}

        {step === 2 && result && (
          <div className="space-y-6">
            <Alert className="rounded-xl print:hidden">
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription>Reorganizamos apenas o que já está no seu currículo. Revise antes de enviar.</AlertDescription>
            </Alert>
            <Card id="print-area" className="rounded-xl">
              <CardContent className="pt-6">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{optimized}</pre>
              </CardContent>
            </Card>
            <Separator className="print:hidden" />
            <div className="flex flex-col gap-3 sm:flex-row print:hidden">
              <Button variant="outline" className="rounded-xl" onClick={() => setStep(1)}><ArrowLeft className="mr-1 h-4 w-4" /> Voltar</Button>
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="secondary" className="rounded-xl" onClick={copy}>{copied ? <><Check className="mr-1 h-4 w-4" /> Copiado!</> : <><Copy className="mr-1 h-4 w-4" /> Copiar Texto</>}</Button>
                <Button variant="secondary" className="rounded-xl" onClick={() => window.print()}><Printer className="mr-1 h-4 w-4" /> Exportar / Imprimir em PDF</Button>
                <Button className="rounded-xl" onClick={reset}><RotateCcw className="mr-1 h-4 w-4" /> Fazer Nova Análise</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
