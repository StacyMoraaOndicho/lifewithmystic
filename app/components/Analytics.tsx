'use client';

import { useEffect } from 'react';

/**
 * Analytics Integration Scaffold
 * 
 * Supports:
 * - Google Analytics 4 (GA4)
 * - PostHog
 * - Plausible
 * - Custom analytics
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function Analytics() {
  useEffect(() => {
    // Google Analytics 4
    if (process.env.NEXT_PUBLIC_GA_ID) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer?.push(arguments);
      }
      (window as any).gtag = gtag;
      gtag('js', new Date());
      gtag('config', process.env.NEXT_PUBLIC_GA_ID);
    }

    // PostHog Analytics
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]]),t[o[o.length-1]]=function(){e+="/"+Array.prototype.slice.call(arguments).join("/");try{var n=new XMLHttpRequest;n.open("GET",e,!0),n.send()}catch(t){console.log("Failed to send PostHog event")}}}}(function(){e.captureEvent=function(){try{var t=new XMLHttpRequest;t.open("POST",s+"/engage",!0),t.send(JSON.stringify({event:"capture",properties:{}})),e.__captureEvent=!0}catch(t){console.log("Failed to capture with PostHog")}}}(),o=function(){e.__captureEvent||g(window,"PostHog.captureEvent")},p=setTimeout(o,2e3),r=function(){clearTimeout(p),o()},window.addEventListener("beforeunload",r),o())}(0);
      `;
      document.head.appendChild(script);
    }

    // Plausible Analytics
    if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      const script = document.createElement('script');
      script.defer = true;
      script.setAttribute('data-domain', process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
      script.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(script);
    }
  }, []);

  return null;
}

// Helper function to track events
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  // Google Analytics 4
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, eventData);
  }

  // Plausible
  if ((window as any).plausible) {
    (window as any).plausible(eventName, eventData);
  }

  // PostHog
  if ((window as any).posthog) {
    (window as any).posthog.capture(eventName, eventData);
  }

  console.log(`[Analytics] Event: ${eventName}`, eventData);
}

/**
 * Usage:
 * 
 * 1. Add to layout.tsx:
 *    import { Analytics } from '@/components/Analytics';
 *    <Analytics />
 * 
 * 2. Set environment variables in .env.local:
 *    NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 *    NEXT_PUBLIC_PLAUSIBLE_DOMAIN=lifewithmystic.com
 *    NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
 * 
 * 3. Track events from components:
 *    import { trackEvent } from '@/components/Analytics';
 *    trackEvent('blog_post_viewed', { slug: 'post-title' });
 */
