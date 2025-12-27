export function isValidUrl(input: string): boolean {
  try {
    const urlWithProtocol =
      input.startsWith('http://') || input.startsWith('https://') ? input : `https://${input}`;
    const url = new URL(urlWithProtocol);
    return url.hostname.includes('.') && url.hostname.length > 3;
  } catch {
    return false;
  }
}

