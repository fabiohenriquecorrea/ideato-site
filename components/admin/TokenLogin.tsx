"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { REPO } from "@/lib/repo-config";
import { Mark, Wordmark } from "../Logo";
import { checkToken } from "./store";

const createUrl =
  "https://github.com/settings/personal-access-tokens/new?" +
  new URLSearchParams({
    name: "Painel do site Ideato",
    description: "Permite que o painel publique o conteúdo do site",
    target_name: REPO.owner,
    expires_in: "366",
    contents: "write",
  }).toString();

/** Entrada do painel: a “senha” é uma chave do GitHub, guardada só neste navegador. */
export function TokenLogin({ onDone }: { onDone: (token: string) => void }) {
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = String(new FormData(e.currentTarget).get("token") ?? "").trim();
    if (!token) return;
    setBusy(true);
    setError(null);
    const problem = await checkToken(token).catch(() => "Sem conexão com o GitHub. Tente de novo.");
    if (problem) {
      setError(problem);
      setBusy(false);
      return;
    }
    onDone(token);
  }

  return (
    <main className="login">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="login-brand">
          <Mark className="mark" />
          <Wordmark className="word" />
        </div>
        <h1>Editor do site</h1>
        <p>
          Cole sua chave de acesso do GitHub. Ela fica guardada só neste navegador — em outro computador,
          é só colar de novo.
        </p>
        <label className="ed-field" htmlFor="token">
          <span className="ed-label">Chave de acesso</span>
          <div className="login-pw">
            <input
              id="token"
              name="token"
              type={show ? "text" : "password"}
              className="ed-input"
              autoComplete="off"
              spellCheck={false}
              placeholder="github_pat_…"
              autoFocus
              required
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "tk-err" : undefined}
            />
            <button type="button" className="ed-link" onClick={() => setShow((s) => !s)}>
              {show ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          {error && (
            <span className="ed-error" id="tk-err" role="alert">
              {error}
            </span>
          )}
        </label>
        <button type="submit" className="ed-btn ed-btn-accent login-submit" disabled={busy}>
          {busy ? "Conferindo…" : "Entrar"}
        </button>
        <a className="ed-link login-back" href={createUrl} target="_blank" rel="noreferrer">
          Não tenho uma chave — criar no GitHub
        </a>
      </form>
    </main>
  );
}
