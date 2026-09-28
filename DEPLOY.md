# Publicação (grátis): GitHub + Cloudflare Pages

Custo mensal: **R$ 0**. Você paga apenas o domínio na Hostinger.

## Como funciona

1. O código e o conteúdo do site ficam num repositório **público** do GitHub.
2. A **Cloudflare Pages** gera o site a partir desse repositório e o publica no seu domínio.
3. No painel (`/admin`), ao clicar em **Publicar**, o painel grava `content/site.json` e
   `content/status.json` no GitHub. A Cloudflare percebe e atualiza o site em ~2 minutos.
4. Imagens/vídeos enviados pelo painel vão para `public/uploads/` no mesmo repositório.

Não há banco de dados nem servidor para manter.

## Configuração (feita uma vez)

### GitHub
- Repositório: público, com o código deste projeto.
- Em `lib/repo-config.ts`, preencher `owner` (usuário do GitHub) e `repo` (nome do repositório).

### Cloudflare Pages
- Workers & Pages → Criar → Pages → **Conectar ao Git** → escolher o repositório.
- Predefinição: **Next.js (Static HTML Export)**
  - Comando de build: `npx next build`
  - Diretório de saída: `out`
- Variável de ambiente (opcional): `SITE_URL=https://ideatostudio.com.br`

### Domínio (Hostinger → Cloudflare)
- Na Cloudflare: **Adicionar site** → `ideatostudio.com.br` → plano **Free**.
- A Cloudflare mostra 2 *nameservers*. Na Hostinger: **Domínios → ideatostudio.com.br →
  DNS / Nameservers → Alterar nameservers** → colar os dois da Cloudflare.
- No projeto do Pages: **Domínios personalizados** → adicionar `ideatostudio.com.br` e
  `www.ideatostudio.com.br`.

### Chave do painel
- O painel pede uma **chave de acesso do GitHub** (fine-grained token) com permissão
  **Contents: Read and write** apenas no repositório do site.
- A chave fica guardada só no navegador onde foi colada. Em outro computador, cole de novo.
- Para revogar: GitHub → Settings → Developer settings → Personal access tokens.

## Limites do plano grátis (folgados para um portfólio)
- Cloudflare Pages: 500 publicações por mês, visitas ilimitadas.
- Arquivos enviados pelo painel: até 25 MB cada (vídeos maiores: comprimir antes).
