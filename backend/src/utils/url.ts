// Só aceita links que são seguros de colocar num <a href> público:
// - http ou https (bloqueia javascript:, data:, file:...);
// - sem usuário/senha ("https://google.com@golpe.com" leva para golpe.com);
// - domínio público com extensão (bloqueia IPs e localhost).
// Sem protocolo, assume https: "empresa.com.br" -> "https://empresa.com.br/".
export function parseWebUrl(text: string) {
  if (text.length > 2048) return null;

  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(text)
    ? text
    : `https://${text}`;

  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    return null;
  }

  const isWeb = url.protocol === "https:" || url.protocol === "http:";
  const hasCredentials = url.username !== "" || url.password !== "";
  const tld = url.hostname.split(".").pop() ?? "";
  const isPublicDomain =
    url.hostname.includes(".") && /^([a-z]{2,63}|xn--[a-z\d-]+)$/i.test(tld);

  return isWeb && !hasCredentials && isPublicDomain ? url : null;
}

// "www.instagram.com" passa; "instagram.com.golpe.com" e "falsoinstagram.com" não
export function isFromDomain(url: URL, domains: string[]) {
  return domains.some(
    (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`),
  );
}
