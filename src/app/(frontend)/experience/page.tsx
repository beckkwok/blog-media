import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getExperience } from '@/lib/site-data'

export const dynamic = 'force-dynamic'

export default async function ExperiencePage() {
  const experience = await getExperience()

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Experience</h1>

      <div className="mt-8 grid gap-6">
        {experience.length === 0 && (
          <p className="text-muted-foreground">
            Nothing here yet — add entries in the admin under Portfolio → Experience.
          </p>
        )}
        {experience.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              {item.organization && <CardDescription>{item.organization}</CardDescription>}
              {item.location && (
                <div className="text-sm text-muted-foreground">{item.location}</div>
              )}
            </CardHeader>
            <CardContent>
              {item.current && (
                <p className="mb-2 text-sm font-medium text-primary">Current</p>
              )}
              {item.startDate && (
                <p className="mb-2 text-sm text-muted-foreground">
                  Since {new Date(item.startDate).getFullYear()}
                  {item.endDate ? ` – ${new Date(item.endDate).getFullYear()}` : ''}
                </p>
              )}
              {item.summary && <p className="mb-4 line-clamp-3">{item.summary}</p>}
              {item.highlights?.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {item.highlights.map((h) => (
                    <li key={h.highlight}>{h.highlight}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button asChild>
          <Link href="/projects">
            View all projects <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

    </div>
  )
}
