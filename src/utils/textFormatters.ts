export const cleanDomainName = (url: string): string => {
  if (!url) return '';
  try {
    const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
    const parsedUrl = new URL(fullUrl);
    let hostname = parsedUrl.hostname;
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }
    return hostname;
  } catch (e) {
    return url
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
      .split('/')[0];
  }
};
