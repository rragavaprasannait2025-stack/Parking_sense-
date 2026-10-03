export const config = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiBase: (import.meta as any).env?.VITE_API_BASE ?? '/api',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wsBase: (import.meta as any).env?.VITE_WS_BASE ?? '/ws',
  appName: 'ParkSense-X',
  appSubtitle: 'Intelligent Parking Platform',
  demoMode: true, // always demo until backend connected
  version: '1.0.0',
}

export const DEMO_MODE_NOTE = 'SIMULATION / DEMO DATA — Values are generated for demonstration purposes.'
