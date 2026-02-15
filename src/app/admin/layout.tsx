'use client'

import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/create-lesson', label: 'Create Lesson' },
    { href: '/admin/lessons', label: 'Lessons' },
    { href: '/admin/lesson-editor', label: 'Editor' },
    { href: '/admin/questions', label: 'Questions' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push('/admin/login');
    } else if (status === "authenticated" && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === "loading" || (status === "authenticated" && session?.user?.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen bg-amber-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
          <p className="text-stone-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated" && session?.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-amber-50/40 flex items-center justify-center">
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

  const isLessonEditorRoute = pathname.startsWith('/admin/lesson-editor');

  if (isLessonEditorRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-amber-50/40 text-stone-900">
      <header className="sticky top-0 z-40 border-b border-amber-200 bg-amber-50/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="font-serif text-lg font-semibold tracking-wide">Administrative Portal</p>
            <p className="text-xs text-stone-600">Algorithms of Thinking and Cognition</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium hover:bg-stone-100"
            >
              Back to Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="rounded-md bg-amber-900 px-3 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px,1fr]">
        <aside className="rounded-lg border border-amber-200 bg-white p-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}
