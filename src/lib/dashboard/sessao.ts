import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const DURACAO_SESSAO_MS = 8 * 60 * 60 * 1000;
const JANELA_TENTATIVAS_MS = 5 * 60 * 1000;
const LIMITE_TENTATIVAS = 10;

export const NOME_COOKIE_SESSAO = "safira_dashboard_sessao";

function lerVariavelAmbiente(nome: string) {
  return process.env[nome]?.trim() ?? "";
}

function obterTokenAcesso() {
  return lerVariavelAmbiente("DASHBOARD_TOKEN");
}

function obterSegredoSessao() {
  return (
    lerVariavelAmbiente("DASHBOARD_SESSION_SECRET") ||
    `safira-dashboard:${obterTokenAcesso()}`
  );
}

export function tokenConfigurado() {
  return obterTokenAcesso().length > 0;
}

export type SessaoDashboard = {
  sid: string;
  expiraEm: number;
};

type ControleTentativas = {
  instantes: number[];
};

type EscopoTentativas = typeof globalThis & {
  __safiraDashboardTentativas?: ControleTentativas;
};

function assinar(dados: string) {
  return createHmac("sha256", obterSegredoSessao()).update(dados).digest("base64url");
}

function compararSeguro(a: string, b: string) {
  const digestA = Buffer.from(a);
  const digestB = Buffer.from(b);
  if (digestA.length !== digestB.length) return false;
  return timingSafeEqual(digestA, digestB);
}

export function tokenCorreto(token: string) {
  const tokenEsperado = obterTokenAcesso();
  if (!tokenEsperado) return false;

  const digestInformado = createHash("sha256").update(token).digest();
  const digestEsperado = createHash("sha256").update(tokenEsperado).digest();
  return timingSafeEqual(digestInformado, digestEsperado);
}

export function criarSessao() {
  const sessao: SessaoDashboard = {
    sid: randomUUID(),
    expiraEm: Date.now() + DURACAO_SESSAO_MS,
  };
  const dados = Buffer.from(JSON.stringify(sessao)).toString("base64url");
  return { valor: `${dados}.${assinar(dados)}`, sessao };
}

export function extrairSessao(valor: string | undefined): SessaoDashboard | null {
  if (!valor) return null;

  const [dados, assinatura] = valor.split(".");
  if (!dados || !assinatura) return null;
  if (!compararSeguro(assinatura, assinar(dados))) return null;

  try {
    const sessao = JSON.parse(
      Buffer.from(dados, "base64url").toString("utf8"),
    ) as SessaoDashboard;

    if (typeof sessao?.sid !== "string") return null;
    if (typeof sessao?.expiraEm !== "number") return null;
    if (sessao.expiraEm <= Date.now()) return null;

    return sessao;
  } catch {
    return null;
  }
}

export function opcoesCookieSessao() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: lerVariavelAmbiente("DASHBOARD_COOKIE_SECURE") === "true",
    path: "/",
  };
}

export const NOME_COOKIE_VISITANTE = "safira_visitante";

export function opcoesCookieVisitante() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: lerVariavelAmbiente("DASHBOARD_COOKIE_SECURE") === "true",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}

function obterControleTentativas(): ControleTentativas {
  const escopo = globalThis as EscopoTentativas;
  escopo.__safiraDashboardTentativas ??= { instantes: [] };
  return escopo.__safiraDashboardTentativas;
}

function limparTentativasAntigas(controle: ControleTentativas, agora: number) {
  controle.instantes = controle.instantes.filter(
    (instante) => agora - instante < JANELA_TENTATIVAS_MS,
  );
}

export function acessoBloqueado() {
  const controle = obterControleTentativas();
  const agora = Date.now();
  limparTentativasAntigas(controle, agora);
  return controle.instantes.length >= LIMITE_TENTATIVAS;
}

export function registrarTentativaInvalida() {
  const controle = obterControleTentativas();
  const agora = Date.now();
  limparTentativasAntigas(controle, agora);
  controle.instantes.push(agora);
}
