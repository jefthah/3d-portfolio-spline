// src/components/SEO/SEOHelper.jsx
import { useEffect } from 'react';

/**
 * Custom SEO Component - Alternative to react-helmet-async
 * Compatible with React 19
 */
export function SEO({ 
  title = "Jefta Portfolio",
  description = "Full Stack Developer Portfolio",
  keywords = "",
  ogTitle = "",
  ogDescription = "",
  ogImage = "/og-image.jpg",
  ogUrl = "https://3d-portfolio-spline.vercel.app/",
  twitterCard = "summary_large_image",
  twitterTitle = "",
  twitterDescription = "",
  twitterImage = "",
  canonicalUrl = "",
  structuredData = null
}) {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (selector, content) => {
      if (!content) return;
      
      let element = document.querySelector(selector);
      
      if (!element) {
        element = document.createElement('meta');
        const attributes = selector.match(/\[([^=]+)="([^"]+)"\]/g);
        
        if (attributes) {
          attributes.forEach(attr => {
            const [key, value] = attr.slice(1, -1).split('="');
            element.setAttribute(key, value);
          });
        }
        
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Update meta tags
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="keywords"]', keywords);
    
    // Open Graph
    updateMetaTag('meta[property="og:title"]', ogTitle || title);
    updateMetaTag('meta[property="og:description"]', ogDescription || description);
    updateMetaTag('meta[property="og:image"]', ogImage);
    updateMetaTag('meta[property="og:url"]', ogUrl);
    updateMetaTag('meta[property="og:type"]', 'website');
    
    // Twitter
    updateMetaTag('meta[name="twitter:card"]', twitterCard);
    updateMetaTag('meta[name="twitter:title"]', twitterTitle || ogTitle || title);
    updateMetaTag('meta[name="twitter:description"]', twitterDescription || ogDescription || description);
    updateMetaTag('meta[name="twitter:image"]', twitterImage || ogImage);

    // Canonical URL
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }

    // Structured Data
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      script.setAttribute('data-seo-script', 'true');
      document.head.appendChild(script);

      // Cleanup function to remove the script when component unmounts
      return () => {
        const scripts = document.querySelectorAll('script[data-seo-script="true"]');
        scripts.forEach(s => s.remove());
      };
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, 
      twitterCard, twitterTitle, twitterDescription, twitterImage, 
      canonicalUrl, structuredData]);

  return null;
}

// SEO Provider Component (simpler than HelmetProvider)
export function SEOProvider({ children }) {
  return children;
}

// Default export for easier import
export default SEO;