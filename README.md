# Ideato Studio — site

Next.js 16 gerado como site estático. Conteúdo em `content/site.json` e `content/status.json`,
editados pelo painel em `/admin`. Hospedagem gratuita: veja [DEPLOY.md](DEPLOY.md).

## Rodar no computador

```bash
npm install
npm run dev -- -p 3100
```

Sem o repositório configurado em `lib/repo-config.ts`, o painel abre em **modo local**
(para testes; nada vai ao ar).

## Painel (`/admin`)

- Estrutura: **Páginas → Seções/âncoras → campos**, com prévia ao vivo e desfazer/refazer (⌘Z / ⌘⇧Z).
- O rascunho fica salvo no navegador. **Publicar** grava no GitHub e o site atualiza em ~2 min.
- **Status do site:** No ar / Em manutenção / Em construção (vale após publicar).
