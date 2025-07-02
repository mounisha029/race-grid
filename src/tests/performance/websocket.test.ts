
import { WebSocket } from 'ws';

describe('WebSocket Performance Tests', () => {
  let ws: WebSocket;

  beforeEach(() => {
    ws = new WebSocket('ws://localhost:8080/ws');
  });

  afterEach(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  });

  test('should handle concurrent connections', async () => {
    const connections: WebSocket[] = [];
    const connectionCount = 100;

    const connectionPromises = Array.from({ length: connectionCount }, () => {
      return new Promise<void>((resolve, reject) => {
        const testWs = new WebSocket('ws://localhost:8080/ws');
        connections.push(testWs);

        testWs.on('open', () => resolve());
        testWs.on('error', reject);
      });
    });

    await Promise.all(connectionPromises);
    expect(connections).toHaveLength(connectionCount);

    // Clean up
    connections.forEach(conn => conn.close());
  }, 10000);

  test('should handle high-frequency live timing updates', async () => {
    const messageCount = 1000;
    const receivedMessages: any[] = [];

    return new Promise<void>((resolve, reject) => {
      ws.on('open', () => {
        // Simulate high-frequency updates
        for (let i = 0; i < messageCount; i++) {
          ws.send(JSON.stringify({
            type: 'live_timing',
            data: { lap: i, position: Math.floor(Math.random() * 20) + 1 }
          }));
        }
      });

      ws.on('message', (data) => {
        receivedMessages.push(JSON.parse(data.toString()));
        
        if (receivedMessages.length === messageCount) {
          expect(receivedMessages).toHaveLength(messageCount);
          resolve();
        }
      });

      ws.on('error', reject);

      // Timeout after 5 seconds
      setTimeout(() => reject(new Error('Test timeout')), 5000);
    });
  });
});
