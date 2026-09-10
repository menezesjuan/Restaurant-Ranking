/**
 * Módulo de Segurança para Integração com Google Maps (Prevenção SSRF, ReDoS e XSS)
 */

const MAX_URL_LENGTH = 2048;

/**
 * Lista branca de hostnames e sufixos permitidos do ecossistema Google Maps.
 */
const ALLOWED_EXACT_HOSTS = new Set([
  'maps.app.goo.gl',
  'goo.gl',
  'maps.google.com',
  'google.com',
  'www.google.com',
]);

/**
 * Valida rigorosamente se uma URL é um link legítimo do Google Maps.
 * Bloqueia expressamente tentativas de SSRF (localhost, IPs internos, outros domínios).
 */
export function isAllowedGoogleMapsUrl(input: string): {
  valid: boolean;
  reason?: string;
  url?: URL;
} {
  if (!input || typeof input !== 'string') {
    return { valid: false, reason: 'Entrada vazia ou inválida' };
  }

  const trimmed = input.trim();

  // Mitigação ReDoS: limitação estrita de tamanho do payload
  if (trimmed.length > MAX_URL_LENGTH) {
    return { valid: false, reason: 'URL excede o comprimento máximo permitido (2048 caracteres)' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, reason: 'Formato de URL malformado' };
  }

  // 1. Apenas protocolo HTTPS estrito é permitido
  if (parsed.protocol !== 'https:') {
    return { valid: false, reason: 'Apenas conexões HTTPS são permitidas' };
  }

  // 2. Bloquear portas customizadas (apenas padrão 443)
  if (parsed.port && parsed.port !== '443') {
    return { valid: false, reason: 'Porta não autorizada' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 3. Bloquear qualquer IP numérico bruto (IPv4 ou IPv6) para proteção SSRF
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':') || hostname === 'localhost') {
    return { valid: false, reason: 'Endereços IP e hosts locais são estritamente proibidos' };
  }

  // 4. Verificação de domínios permitidos
  let isGoogleMaps = false;

  if (ALLOWED_EXACT_HOSTS.has(hostname)) {
    isGoogleMaps = true;
  } else if (
    // Aceita google.co.uk, google.com.br, etc.
    hostname.startsWith('www.google.') ||
    hostname.startsWith('maps.google.') ||
    hostname.startsWith('google.')
  ) {
    isGoogleMaps = true;
  }

  if (!isGoogleMaps) {
    return { valid: false, reason: `Domínio não autorizado: ${hostname}` };
  }

  // 5. Para domínios gerais como google.com ou goo.gl, exigir que o caminho seja de mapas
  if (hostname === 'goo.gl' && !parsed.pathname.startsWith('/maps')) {
    return { valid: false, reason: 'Caminho do goo.gl não pertence ao Google Maps' };
  }

  return { valid: true, url: parsed };
}

/**
 * Sanitiza strings textuais removendo tags HTML, scripts e normalizando entidades.
 * Prevenção de XSS e injeção de dados maliciosos.
 */
export function sanitizeText(raw?: string | null): string {
  if (!raw || typeof raw !== 'string') return '';

  let text = raw;

  // Remove blocos de script e style completos
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove qualquer tag HTML remanescente
  text = text.replace(/<\/?[^>]+(>|$)/g, '');

  // Decodifica entidades HTML comuns
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');

  return text.trim();
}
