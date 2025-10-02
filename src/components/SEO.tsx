import { useEffect } from 'react';

export const SEO = () => {
  useEffect(() => {
    // Use production URL for OG tags, or fallback to current origin
    const isProduction = import.meta.env.PROD;
    const currentOrigin = window.location.origin + window.location.pathname.replace(/\/$/, '');

    const baseUrl = isProduction
      ? (import.meta.env.VITE_APP_URL || currentOrigin)
      : currentOrigin;

    const fullUrl = baseUrl;
    const ogImageUrl = `${baseUrl}/og-image.png`;

    // Update og:url
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', fullUrl);
    }

    // Update og:image
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', ogImageUrl);
    }

    // Update twitter:image
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', ogImageUrl);
    }
  }, []);

  return null;
};
