/**
 * Repositório do GitHub onde o painel publica o conteúdo.
 * Enquanto estiver vazio, o painel funciona em "modo local" (só para testes).
 */
export const REPO = {
  owner: "fabiohenriquecorrea",
  repo: "ideato-site",
  branch: "main",
};

export const repoConfigured = () => Boolean(REPO.owner && REPO.repo);
