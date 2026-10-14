import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { AdminLogin } from '@/components/admin/admin-login'
import { isAdminAuthenticated, isPinConfigured } from '@/lib/admin-auth'
import { getSiteContent } from '@/lib/content-store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Quản trị nội dung — Mai Phương',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const configured = isPinConfigured()
  const authenticated = configured && (await isAdminAuthenticated())
  if (!authenticated) return <AdminLogin configured={configured} />
  return <AdminDashboard initialContent={await getSiteContent()} />
}

