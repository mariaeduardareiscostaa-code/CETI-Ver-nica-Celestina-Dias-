import { createApiApp } from '../server.ts';

let appPromise: Promise<Awaited<ReturnType<typeof createApiApp>>> | null = null;

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = createApiApp();
  }
  const app = await appPromise;
  return app(req, res);
}
