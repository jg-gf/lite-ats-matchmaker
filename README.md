# Lite Ats Matchmaker

crie a aplicação com base no markdown abaixo

# Especificação de Aplicação: Gerador de Currículos ATS Friendly

Crie uma aplicação web moderna e responsiva construída 100% no Lovable, focada em matchmaking entre vagas de emprego e currículos, gerando versões otimizadas e compatíveis com sistemas ATS (Applicant Tracking Systems).

---

## ⚠️ DIRETRIZ CRÍTICA DE ESCOPO E CRÉDITOS
- **Entrega Completa no Primeiro Prompt:** A aplicação deve ser entregue 100% funcional e implementada de ponta a ponta já nesta primeira geração.
- **Sem Placeholders:** Não deixe telas pela metade, botões sem ação ou comentários do tipo "TODO: implementar depois".
- **Lógica Front-end Autossuficiente:** Todo o fluxo (validação, cálculo do match, extração de palavras-chave simulada e formatação do currículo) deve funcionar no estado da aplicação (React/Vite/Tailwind), sem depender de chamadas externas ou autenticação. Isso é essencial para que o projeto caiba nas poucas interações dos 5 créditos disponíveis.

---

## 1. Princípios Gerais e Acesso
- **Sem autenticação:** A aplicação não possui tela de login nem cadastro. O usuário entra e já executa a análise diretamente.
- **Regra Ética Fundamental:** A ferramenta melhora a forma como a pessoa se apresenta e adapta o vocabulário para os sistemas ATS, mas **nunca inventa experiências ou qualificações que a pessoa não possui**.

---

## 2. Design System & Identidade Visual
- **Design System:** Use componentes oficiais do **shadcn/ui** (Card, Button, Progress, Badge, Textarea, Input, Alert, Tabs, Separator).
- **Paleta de Cores Calmas:**
  - Base: Branco e cinza neutro suave (`bg-white`, `bg-slate-50`).
  - Tons Primários: Azul ardósia suave (`slate-700`, `sky-600`, bordas em `slate-200`).
  - Acentos Sutis: Tons pastéis (verde suave para palavras encontradas, âmbar/amarelo claro para termos faltantes).
- **Estilo:** Visual limpo, profissional, cantos arredondados (`rounded-xl`), boa respiração entre seções e tipografia sem serifa altamente legível.

---

## 3. Landing Page (Página Inicial)
- **Hero Section:**
  - Título objetivo focado no problema: Otimize seu currículo para passar pelos filtros de sistemas ATS.
  - Subtítulo explicando que a ferramenta analisa requisitos e alinha seu currículo sem burocracia.
- **Aviso Ético em Destaque:**
  - Um card/alerta visível (`Alert` do shadcn/ui) contendo o texto:
    > "Esta ferramenta melhora como você se apresenta e nunca inventa experiência que você não tem."
- **CTA Principal:** Botão em destaque "Começar Análise Agora" que avança diretamente para o Wizard interativo.

---

## 4. Fluxo em Wizard (Passos Sequenciais)
Implemente um indicador visual de progresso com 3 etapas no topo:

### Etapa 1: Inserção de Dados
- **Link da Vaga (Opcional):** Campo de texto (`Input`) para a URL da vaga.
- **Descrição da Vaga (Obrigatório):** `Textarea` amplo para colar os requisitos e responsabilidades da vaga anunciada.
- **Seu Currículo Atual (Obrigatório):** `Textarea` amplo para colar o texto completo do currículo da pessoa.
- **Ação:** Botão "Analisar Compatibilidade" (desabilitado se os campos obrigatórios estiverem vazios), com estado de loading visual.

### Etapa 2: Diagnóstico e Matchmaking ATS
- **Métricas Principais:**
  - Destaque numérico da **Porcentagem de Compatibilidade** (ex.: 84% de Match).
  - **Barra de Progresso** animada (`Progress` do shadcn) visualizando o índice.
- **Análise de Palavras-Chave:**
  - **Palavras-chave encontradas:** Badges verdes suaves com termos da vaga presentes no currículo.
  - **Palavras-chave que faltam:** Badges em amarelo claro/âmbar com termos da vaga não localizados.
- **Espaço para Insights Adicionais:**
  - Card com *Pontos Fortes* do currículo em relação à vaga.
  - Card com *Sugestões Práticas de Ajuste*.
- **Navegação:** Botão "Avançar para Versão ATS Friendly" e botão "Voltar e editar dados".

### Etapa 3: Currículo Otimizado & Exportação
- **Visualização do Currículo Adaptado:**
  - Estrutura textual limpa seguindo padrão ATS (Resumo Profissional, Habilidades Alinhadas, Experiência Profissional e Formação).
  - Texto reorganizado valorizando as competências reais da pessoa, sem invenções.
- **Ações de Exportação Prontas:**
  - Botão "Copiar Texto" (com feedback funcional na tela).
  - Botão "Exportar / Imprimir em PDF" (usando `window.print()` com CSS de impressão otimizado para documento limpo).
  - Botão "Fazer Nova Análise" (limpa o estado e volta para o início).

---

## 5. Requisitos Técnicos
- Todos os passos do Wizard devem ser integrados e interativos já no primeiro build.
- Interface 100% responsiva (mobile e desktop).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://lite-ats-matchmaker.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bdee4336-2431-451e-9772-67035dbe7636).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
