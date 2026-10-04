// @vitest-environment node
import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { AIMessage, type BaseMessage } from '@langchain/core/messages'
import type { ChatResult } from '@langchain/core/outputs'
import { getPayload, type Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { getSkill } from '@/agents/skills'
import { runSkill } from '@/agents/skills/authorize'
import { runSingleShot } from '@/agents/run'
import { type Permission } from '@/collections/helpers/access'
import { plainTextToLexical } from '@/lib/lexical'

/** Minimal fake chat model that returns a scripted list of messages (tool calls supported). */
class ScriptedChatModel extends BaseChatModel {
  private i = 0

  constructor(private readonly script: BaseMessage[]) {
    super({})
  }

  _llmType(): string {
    return 'scripted'
  }

  bindTools(): this {
    return this
  }

  async _generate(): Promise<ChatResult> {
    const message = this.script[Math.min(this.i, this.script.length - 1)]
    this.i += 1
    return {
      generations: [
        {
          text: typeof message.content === 'string' ? message.content : '',
          message,
        },
      ],
    }
  }
}

let payload: Payload
const stamp = Date.now()

async function makeRole(permissions: Permission[] = []) {
  return payload.create({
    collection: 'roles',
    data: {
      name: `page-role-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      permissions,
    },
    overrideAccess: true,
  })
}

async function makeUser(roleId: number | null, type: 'User' | 'Admin' = 'User') {
  return payload.create({
    collection: 'users',
    data: {
      email: `page-acc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.local`,
      password: 'test-password',
      name: 'Page Acc',
      type,
      role: roleId ?? undefined,
    },
    overrideAccess: true,
  })
}

async function makePage(slug: string, published: boolean) {
  return payload.create({
    collection: 'pages',
    data: {
      title: `Page ${slug}`,
      slug,
      content: plainTextToLexical(`Content for ${slug}.`),
      published,
    },
    overrideAccess: true,
  })
}

describe('static pages (integration)', () => {
  beforeAll(async () => {
    process.env.MOCK_LLM = '1'
    process.env.MOCK_EMBEDDINGS = '1'
    payload = await getPayload({ config: await config })
  })

  it('an admin can create a page; a non-privileged user cannot', async () => {
    const admin = await makeUser(null, 'Admin')
    const created = await payload.create({
      collection: 'pages',
      data: { title: 'T', slug: `page-${stamp}-a`, content: plainTextToLexical('x') },
      overrideAccess: false,
      user: admin,
    })
    expect(created.id).toBeTruthy()

    const plain = await makeUser(null)
    await expect(
      payload.create({
        collection: 'pages',
        data: { title: 'T', slug: `page-${stamp}-b`, content: plainTextToLexical('x') },
        overrideAccess: false,
        user: plain,
      }),
    ).rejects.toThrow()
  })

  it('a role with content.write can create and update a page', async () => {
    const role = await makeRole(['content.write'])
    const user = await makeUser(role.id)

    const created = await payload.create({
      collection: 'pages',
      data: { title: 'T', slug: `page-${stamp}-c`, content: plainTextToLexical('x') },
      overrideAccess: false,
      user,
    })
    expect(created.id).toBeTruthy()

    const updated = await payload.update({
      collection: 'pages',
      id: created.id,
      data: { title: 'T2' },
      overrideAccess: false,
      user,
    })
    expect(updated.title).toBe('T2')
  })

  it('getPage returns published pages and hides drafts', async () => {
    await makePage(`pub-${stamp}`, true)
    await makePage(`draft-${stamp}`, false)
    const skill = getSkill('getPage')
    expect(skill).toBeDefined()

    const found = (await runSkill(skill!, { slug: `pub-${stamp}` }, { payload })) as {
      page: { slug: string } | null
    }
    expect(found.page?.slug).toBe(`pub-${stamp}`)

    const hidden = (await runSkill(skill!, { slug: `draft-${stamp}` }, { payload })) as {
      page: null
    }
    expect(hidden).toEqual({ page: null })
  })

  it('unpublished pages are not publicly readable', async () => {
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: `draft-${stamp}` }, published: { equals: true } },
      limit: 1,
      depth: 0,
    })
    expect(result.totalDocs).toBe(0)
  })

  it('an agent can call getPage during a run', async () => {
    await makePage(`agent-${stamp}`, true)

    const principal = await payload.create({
      collection: 'users',
      data: {
        email: `page-tool-${stamp}@test.local`,
        password: 'test-password',
        name: 'Page Tool Principal',
        type: 'Agent',
      },
      overrideAccess: true,
    })
    const agent = await payload.create({
      collection: 'agents',
      data: {
        name: `Page Agent ${stamp}`,
        kind: 'single-shot',
        status: 'active',
        runAccess: 'authenticated',
        capabilities: [],
        tools: ['getPage'],
        user: principal.id,
        prompt: plainTextToLexical('You answer from static pages.'),
      },
      overrideAccess: true,
    })

    const model = new ScriptedChatModel([
      new AIMessage({
        content: '',
        tool_calls: [{ name: 'getPage', args: { slug: `agent-${stamp}` }, id: 'call_1', type: 'tool_call' }],
      }),
      new AIMessage({ content: 'Here is the page.' }),
    ])

    const result = await runSingleShot({ payload, agentId: agent.id, input: 'Show me the page.', model })
    expect(result.output).toBe('Here is the page.')
  })
})
