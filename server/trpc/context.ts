import { auth } from '../../server/auth';
import { prisma } from '../prisma';

export async function createContext() {
  const session = await auth();
  let userId = session?.user?.id ?? null;
  if (!userId) {
    const demoUser = await prisma.user.findFirst();
    userId = demoUser?.id ?? null;
  }
  return {
    session,
    userId
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
