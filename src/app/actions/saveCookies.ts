'use server';

import { cookies } from 'next/headers';

export async function saveCookies(token: string) {
  const cookieStore = await cookies();

  cookieStore.set('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
}
