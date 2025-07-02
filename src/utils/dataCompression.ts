
// Utility for compressing and decompressing data for real-time updates
export class DataCompression {
  // Simple compression using JSON stringify with reduced precision
  static compress(data: any): string {
    try {
      // Reduce precision for floating point numbers
      const processedData = this.reduceFloatPrecision(data);
      
      // Convert to JSON string
      const jsonStr = JSON.stringify(processedData);
      
      // Simple compression using LZ-style approach (basic)
      return this.simpleCompress(jsonStr);
    } catch (error) {
      console.error('Compression failed:', error);
      return JSON.stringify(data);
    }
  }

  static decompress(compressedData: string): any {
    try {
      const decompressed = this.simpleDecompress(compressedData);
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Decompression failed:', error);
      return JSON.parse(compressedData);
    }
  }

  private static reduceFloatPrecision(obj: any, precision: number = 3): any {
    if (typeof obj === 'number' && !Number.isInteger(obj)) {
      return Math.round(obj * Math.pow(10, precision)) / Math.pow(10, precision);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.reduceFloatPrecision(item, precision));
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.reduceFloatPrecision(value, precision);
      }
      return result;
    }
    
    return obj;
  }

  private static simpleCompress(str: string): string {
    // Simple dictionary-based compression for common F1 terms
    const dictionary = {
      'position': 'pos',
      'driver': 'drv',
      'team': 'tm',
      'points': 'pts',
      'championship': 'chmp',
      'race': 'rc',
      'lap_time': 'lt',
      'sector': 'sec',
      'fastest': 'fst',
      'current': 'cur',
      'session': 'ses',
      'qualifying': 'qual',
      'constructor': 'cons'
    };

    let compressed = str;
    Object.entries(dictionary).forEach(([full, short]) => {
      compressed = compressed.replace(new RegExp(`"${full}"`, 'g'), `"${short}"`);
    });

    return compressed;
  }

  private static simpleDecompress(str: string): string {
    // Reverse the simple compression
    const dictionary = {
      'pos': 'position',
      'drv': 'driver',
      'tm': 'team',
      'pts': 'points',
      'chmp': 'championship',
      'rc': 'race',
      'lt': 'lap_time',
      'sec': 'sector',
      'fst': 'fastest',
      'cur': 'current',
      'ses': 'session',
      'qual': 'qualifying',
      'cons': 'constructor'
    };

    let decompressed = str;
    Object.entries(dictionary).forEach(([short, full]) => {
      decompressed = decompressed.replace(new RegExp(`"${short}"`, 'g'), `"${full}"`);
    });

    return decompressed;
  }
}

// WebSocket wrapper with compression
export class CompressedWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessage: (data: any) => void;
  private onOpen?: () => void;
  private onClose?: () => void;
  private onError?: (error: Event) => void;

  constructor(
    url: string, 
    onMessage: (data: any) => void,
    onOpen?: () => void,
    onClose?: () => void,
    onError?: (error: Event) => void
  ) {
    this.url = url;
    this.onMessage = onMessage;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.onError = onError;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('Compressed WebSocket connected');
        this.onOpen?.();
      };

      this.ws.onmessage = (event) => {
        try {
          // Decompress the data before processing
          const decompressedData = DataCompression.decompress(event.data);
          this.onMessage(decompressedData);
        } catch (error) {
          console.error('Failed to decompress message:', error);
          // Fallback to regular JSON parsing
          try {
            this.onMessage(JSON.parse(event.data));
          } catch (parseError) {
            console.error('Failed to parse message:', parseError);
          }
        }
      };

      this.ws.onclose = () => {
        console.log('Compressed WebSocket disconnected');
        this.onClose?.();
      };

      this.ws.onerror = (error) => {
        console.error('Compressed WebSocket error:', error);
        this.onError?.(error);
      };

    } catch (error) {
      console.error('Failed to create compressed WebSocket:', error);
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const compressedData = DataCompression.compress(data);
      this.ws.send(compressedData);
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
