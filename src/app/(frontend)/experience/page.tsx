import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getExperience } from '@/lib/site-data'

export default async function ExperiencePage() {
  const experience = await getExperience()

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="prose max-w-none mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent>
            {experience.map((item) => (
              <div key={item.id} className="mb-8">
                <CardHeader>
                  <CardTitle>
                    <Link href="/projects" className="no-underline">
                      {item.title}
                    </Link>
                  </CardHeader>
                  {item.organization && (
                    <CardDescription>
                      <span className="text-sm text-muted-foreground">
                        {item.organization}
                      </span>
                    </CardDescription>
                  )}
                  {item.location && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      {item.location}
                    </div>
                  )}
                </CardHeader>
                {item.current && (
                  <CardFooter>
                    <span className="text-sm font-medium text-primary">Current</span>
                  </CardFooter>
                )}
                {item.startDate && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    <span className="me-2">Since</span>
                    {new Date(item.startDate).getFullYear()}
                  </div>
                )}
                <CardContent>
                  <p className="mb-4 line-clamp-3">
                    {item.summary}
                  </p>
                  {item.highlights?.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {item.highlights.map((h) => (
                        <li key={h.highlight}>{h.highlight}</li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-8">
          <Button asChild>
            <Link href="/projects" className="underline">
              View all projects <ArrowRight className="inline" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}