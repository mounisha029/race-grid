
interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
    this.measureNavigationTiming();
  }

  private initializeObservers() {
    // Observe paint metrics
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.firstContentfulPaint = entry.startTime;
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);

        // Observe LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // Observe CLS
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.metrics.cumulativeLayoutShift = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);

        // Observe FID
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  }

  private measureNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.loadTime = navigation.loadEventEnd - navigation.navigationStart;
        this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
      }
    }
  }

  // Get current metrics
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  // Report metrics (for analytics)
  reportMetrics() {
    const metrics = this.getMetrics();
    console.log('Performance Metrics:', metrics);
    
    // Send to analytics service (optional)
    if (window.gtag) {
      Object.entries(metrics).forEach(([key, value]) => {
        if (value !== undefined) {
          window.gtag('event', 'timing_complete', {
            name: key,
            value: Math.round(value)
          });
        }
      });
    }

    return metrics;
  }

  // Cleanup observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  // Measure resource timing
  getResourceTiming() {
    if ('performance' in window) {
      const resources = performance.getEntriesByType('resource');
      const resourceMetrics = resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: (resource as any).transferSize || 0,
        type: this.getResourceType(resource.name)
      }));

      return {
        totalResources: resources.length,
        totalSize: resourceMetrics.reduce((sum, r) => sum + r.size, 0),
        slowestResources: resourceMetrics
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 10),
        resourcesByType: this.groupResourcesByType(resourceMetrics)
      };
    }
    return null;
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image';
    if (url.includes('font')) return 'font';
    return 'other';
  }

  private groupResourcesByType(resources: any[]) {
    return resources.reduce((acc, resource) => {
      const type = resource.type;
      if (!acc[type]) {
        acc[type] = { count: 0, totalSize: 0, totalDuration: 0 };
      }
      acc[type].count++;
      acc[type].totalSize += resource.size;
      acc[type].totalDuration += resource.duration;
      return acc;
    }, {});
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for performance optimization
export const optimizeImages = {
  // Preload critical images
  preloadImages: (imageUrls: string[]) => {
    imageUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  },

  // Lazy load images with intersection observer
  createLazyLoader: (callback: (entries: IntersectionObserverEntry[]) => void) => {
    return new IntersectionObserver(callback, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
  }
};

// Bundle size monitoring
export const bundleAnalyzer = {
  analyzeChunks: () => {
    if ('performance' in window) {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      
      return {
        scripts: scripts.map(script => ({
          src: (script as HTMLScriptElement).src,
          async: (script as HTMLScriptElement).async,
          defer: (script as HTMLScriptElement).defer
        })),
        styles: styles.map(style => ({
          href: (style as HTMLLinkElement).href
        }))
      };
    }
    return null;
  }
};
