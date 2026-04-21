
import AdminDashboard from '@/components/admin/AdminDashboard'
import Wrapper from '@/layouts/Wrapper'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Sahit Sai',
  description: 'Private admin dashboard for portfolio management.',
  robots: 'noindex, nofollow', // Ensure search engines don't index this page
}

export default function AdminPage() {
  return (
    <AdminDashboard />
  )
}
