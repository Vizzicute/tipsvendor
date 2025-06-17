'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function AdSenseManager() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [pathname])

  return null
}
