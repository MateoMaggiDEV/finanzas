'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('martina@nombre.app');
  const [password, setPassword] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow"
        onSubmit={async (event) => {
          event.preventDefault();
          await signIn('credentials', { email, password, callbackUrl: '/' });
        }}
      >
        <h1 className="text-xl font-semibold text-slate-900">Ingresar</h1>
        <label className="block text-sm">
          Email
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <Button type="submit" className="w-full">
          Ingresar
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => signIn('google')}>
          Continuar con Google
        </Button>
      </form>
    </div>
  );
}
