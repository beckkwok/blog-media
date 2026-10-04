import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React from 'react'

import { RichText } from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { getPublishedPage } from '@/lib/site-data'
import { siteConfig } from '@/lib/site'

export const dynamic = 'force-dynamic'

type AboutProps = {
  searchParams: Promise<{ preview?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPage('about')
  return {
    title: page?.title ?? `About · ${siteConfig.name}`,
    description: page?.excerpt || siteConfig.description,
  }
}

/**
 * About page — rendered from the framework `Pages` collection (`slug: about`),
 * editable in the admin with no code change. Falls back to a static intro when
 * no published page exists yet (e.g. before seeding).
 */
export default async function AboutPage({ searchParams }: AboutProps) {
  const { preview } = await searchParams
  const page = await getPublishedPage('about', { draft: preview === 'true' })
  const cover = page?.coverImage && typeof page.coverImage !== 'number' ? page.coverImage : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      {preview === 'true' && page && (
        <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          <span className="font-medium">Draft preview</span> — this page is not published.
        </div>
      )}

      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
        {page?.title ?? 'About'}
      </h1>

      {page?.excerpt && <p className="mt-4 text-lg text-muted-foreground">{page.excerpt}</p>}

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

      {page ? (
        <div className="typeset typeset-docs mt-8 max-w-[42em]">
          <RichText content={page.content} />
        </div>
      ) : (
        <p className="mt-8 text-muted-foreground">
          Nothing published yet — create a page with slug <code>about</code> in the admin.
        </p>
      )}

      <div className="mt-10">
        <Button asChild>
          <Link href="/projects">
            View my projects <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
