import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'

import { RichText } from '@/components/RichText'
import { getPublishedPage } from '@/lib/site-data'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPublishedPage(slug)
  if (!page) return {}

  return {
    title: page.title,
    description: page.excerpt || undefined,
    robots: { index: false, follow: false },
    alternates: { canonical: absoluteUrl(`/${page.slug}`) },
    openGraph: {
      title: page.title,
      description: page.excerpt || undefined,
      type: 'website',
      url: absoluteUrl(`/${page.slug}`),
      siteName: siteConfig.name,
    },
  }
}

export default async function StaticPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { preview } = await searchParams
  const isPreview = preview === 'true'
  const page = await getPublishedPage(slug, { draft: isPreview })

  if (!page) notFound()

  const cover = page.coverImage && typeof page.coverImage !== 'number' ? page.coverImage : null

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      {isPreview && (
        <div className="mb-8 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          <span className="font-medium">Draft preview</span> — this page is not published.
        </div>
      )}

      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{page.title}</h1>

      {page.excerpt && <p className="mt-4 text-lg text-muted-foreground">{page.excerpt}</p>}

      {cover?.url && (
        <div className="mt-8 overflow-hidden rounded-xl border">
          <Image
            src={cover.url}
            alt={cover.alt || page.title}
            width={cover.width || 1200}
            height={cover.height || 630}
            className="h-auto w-full"
            unoptimized={cover.url.startsWith('/api/')}
          />
        </div>
      )}

      <div className="typeset typeset-docs mt-8 max-w-[42em]">
        <RichText content={page.content} />
      </div>
    </article>
  )
}
