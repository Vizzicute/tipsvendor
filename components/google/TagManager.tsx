'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function GTMManager() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/admin')) return

    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: pathname,
      })
    }
  }, [pathname])

  return null
}
