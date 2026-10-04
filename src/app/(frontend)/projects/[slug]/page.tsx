import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getPayloadClient } from '@/lib/site-data'

export const dynamic = 'force-dynamic'

type ProjectProps = {
  params: Promise<{ slug: string }>
}

export default async function ProjectsDetailPage({ params }: ProjectProps) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  const doc = docs[0]

  if (!doc) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{doc.title}</CardTitle>
          {doc.summary && <CardDescription className="text-base">{doc.summary}</CardDescription>}
        </CardHeader>
        <CardContent>
          {doc.stack?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {doc.stack.map((s) => (
                <Badge key={s.tech} variant="secondary" className="text-xs">
                  {s.tech}
                </Badge>
              ))}
            </div>
          )}
          {doc.url && (
            <div className="mt-4">
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View live demo <ArrowRight className="inline size-4" />
              </a>
            </div>
          )}
          {doc.repoUrl && (
            <div className="mt-2">
              <a
                href={doc.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View source code <ArrowRight className="inline size-4" />
              </a>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Back home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
