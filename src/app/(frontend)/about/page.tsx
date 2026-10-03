import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { extractTags, siteConfig } from '@/lib/site'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          {siteConfig.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          {siteConfig.description}
        </p>

        <Card className="prose max-w-none">
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Welcome to my personal portfolio and AI-education media site. I'm Beck,
              a builder and educator sharing experiences, projects, and insights about
              software development and artificial intelligence.
            </p>
            <p className="mb-6">
              This site is built with the AACMS (Agent-Enabled CMS) framework, which
              combines Payload CMS with embedded LangChain.js agents. You'll find
              content about my experience, selected projects, and blog posts about
              AI education.
            </p>

            <details className="mt-8">
              <summary>Read more about my journey</summary>
              <p className="text-muted-foreground">
                I've been building software and sharing knowledge for several years.
                This site represents my personal journey in technology and education,
              </p>
            </details>
          </CardContent>

          <CardFooter>
            <Button asChild>
              <Link href="/projects" className="underline">
                View my projects <ArrowRight className="inline" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}