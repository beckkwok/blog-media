import Link from 'next/link'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getPayloadClient } from '@/lib/site-data'

export default async function ProjectsDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const payload = await getPayloadClient()
  const { doc } = await payload.findByID({
    collection: 'projects',
    id: params.slug,
    // biome-ignore lint/suspicious/noExplicitAny: <reason>
    depth: 0,
  })

  if (!doc) {
    return <div className="p-4">Project not found</div>
  }

  return (
    <div className="prose max-w-none mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <Link href="/projects" className="no-underline">
              {doc.title}
            </Link>
          </CardHeader>
          {doc.summary && (
            <CardDescription>
              {doc.summary}
            </CardDescription>
          )}
          {doc.stack?.length > 0 && (
            <CardFooter className="pt-2">
              <span className="text-sm text-muted-foreground">
                {doc.stack.map((s) => (
                  <Badge key={s.tech} variant="subtle" className="text-xs">
                    {s.tech}
                  </Badge>
                ))}
              </span>
            </CardFooter>
          )}
          {doc.url && (
            <div className="mt-4">
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View live demo <ArrowRight className="inline" />
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
                View source code <ArrowRight className="inline" />
              </a>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}