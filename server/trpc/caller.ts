import { appRouter } from './router';
import { createContext } from './context';

export async function createCaller() {
  const ctx = await createContext();
  return appRouter.createCaller(ctx);
}
