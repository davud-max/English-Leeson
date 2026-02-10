'use client'

import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Ждем завершения загрузки сессии
    
    if (status === "unauthenticated") {
      // Если пользователь не авторизован, перенаправляем на страницу входа администратора
      router.push('/admin/login');
    } else if (status === "authenticated" && session?.user?.role !== 'ADMIN') {
      // Если пользователь авторизован, но не администратор, перенаправляем на главную
      router.push('/');
    }
  }, [session, status, router]);

  // Показываем загрузочный экран, пока проверяется сессия
  if (status === "loading" || (status === "authenticated" && session?.user?.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не админ, показываем сообщение (редирект происходит через useEffect)
  if (status === "authenticated" && session?.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Access Denied</h2>
          <p className="text-stone-600 mb-6">
            You do not have administrator privileges.
          </p>
          <Link href="/" className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Показываем содержимое, если пользователь является администратором
  return <>{children}</>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}