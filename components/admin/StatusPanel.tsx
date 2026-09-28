"use client";

import { MODE_LABEL, type SiteMode, type SiteStatus } from "@/lib/status-types";
import { FieldView } from "./Fields";
import type { Field } from "./schema";

const screenFields: Field[] = [
  { kind: "text", key: "note", label: "Etiqueta", hint: "Aparece no canto superior. Ex.: “Volta às 18h”." },
  { kind: "text", key: "title1", label: "Título — linha 1" },
  { kind: "text", key: "title2", label: "Título — linha 2 (em lima)" },
  { kind: "textarea", key: "text", label: "Texto", rows: 3 },
  { kind: "media", key: "image", label: "Imagem de fundo" },
  { kind: "range", key: "opacity", label: "Opacidade do fundo", min: 0, max: 70, suffix: "%" },
  { kind: "toggle", key: "showContact", label: "Mostrar botão de contato" },
];

const MODES: { mode: SiteMode; hint: string }[] = [
  { mode: "online", hint: "Todo mundo vê o site normalmente." },
  { mode: "maintenance", hint: "Visitantes veem um aviso temporário. Use para ajustes rápidos." },
  { mode: "construction", hint: "Visitantes veem uma página de lançamento. Use antes de estrear o site." },
];

export function StatusPanel({
  status,
  screen,
  onScreen,
  onChange,
}: {
  status: SiteStatus;
  screen: "maintenance" | "construction";
  onScreen: (s: "maintenance" | "construction") => void;
  onChange: (next: SiteStatus, opts?: { confirmMode?: boolean }) => void;
}) {
  const data = status[screen] as unknown as Record<string, unknown>;

  return (
    <>
      <div className="ed-insp-head">
        <p className="ed-crumbs">
          Configurações do site<span aria-hidden="true">/</span>
        </p>
        <h2>Status do site</h2>
        <p className="ed-note">Escolha o que os visitantes veem e clique em Publicar. O site muda em cerca de 2 minutos.</p>
      </div>

      <div className="ed-insp-body">
        <div className="ed-field">
          <span className="ed-label">O que os visitantes veem</span>
          <div className="ed-modes" role="radiogroup" aria-label="Status do site">
            {MODES.map(({ mode, hint }) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={status.mode === mode}
                className="ed-mode"
                data-mode={mode}
                onClick={() => {
                  if (mode === status.mode) return;
                  onChange({ ...status, mode }, { confirmMode: true });
                  if (mode !== "online") onScreen(mode);
                }}
              >
                <span className="ed-mode-dot" aria-hidden="true" />
                <strong>{MODE_LABEL[mode]}</strong>
                <span>{hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ed-field">
          <span className="ed-label">Editar a tela de</span>
          <div className="ed-seg" role="tablist" aria-label="Tela">
            {(["maintenance", "construction"] as const).map((s) => (
              <button key={s} type="button" role="tab" aria-pressed={screen === s} aria-selected={screen === s} onClick={() => onScreen(s)}>
                {s === "maintenance" ? "Manutenção" : "Em construção"}
              </button>
            ))}
          </div>
          {status.mode !== screen && (
            <span className="ed-hint">
              Esta tela não está ativa agora. A prévia ao lado mostra como ela vai ficar.
            </span>
          )}
        </div>

        {screenFields.map((f) => (
          <FieldView
            key={"key" in f ? f.key : f.kind}
            field={f}
            data={data}
            onChange={(k, v) => onChange({ ...status, [screen]: { ...status[screen], [k]: v } })}
          />
        ))}
      </div>
    </>
  );
}
