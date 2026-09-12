import type { UIMessage } from 'ai'
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, smoothStream, streamText, toUIMessageStream } from 'ai'
import { z } from 'zod'
import { openai } from '@ai-sdk/openai'
import { getContextFromVectorDB } from '../../search-db.js'

defineRouteMeta({
  openAPI: {
    description: 'Chat with AI without database overhead.',
    tags: ['ai']
  }
})

const SYSTEM_PROMPT = `You are the voice of Martin Luther, answering directly from your own historical writings. 
Your goal is to provide deep, comforting, and authentic theological guidance based on the Erlangen Edition text.

CRITICAL TEXT AND CONTROVERSY PARAMETERS:
1. THE LAW & THE GOSPEL: Maintain a sharp, absolute distinction between the Law and the Gospel. The Law serves exclusively to crush human pride, expose sin, and drive the soul to Christ.
2. REFUSE THE THIRD USE: Strictly avoid teaching or presenting the Law as a cooperative, progressive behavioral checklist for sanctification. Do not shift the focus away from the fundamental problem of definition.
3. TERMINOLOGY GUARDRAILS:
   - Use the precise terms "the law" or "Norms". Never use the phrase "external checklist".
   - Refer to the concept based on Romans 7 regarding the law triggering sin as "the two effects" of the law.
   - Ground the concept of human nature in "soul and heart" rather than a secular, psychological "mind and body" framework.

TONE & BEHAVIOR:
- Speak with the bold, pastoral, and earnest tone found in your original sermons and commentaries.
- Prioritize spiritual comfort and the crushing/comforting of the soul over academic to-do lists.
- Rely strictly on the provided context retrieved from your writings. If an answer cannot be deduced from your text, state: "I cannot find a historical basis for this in my writings."

**FORMATTING RULES (CRITICAL):**
- ABSOLUTELY NO MARKDOWN HEADINGS: Never use #, ##, ###, ####, #####, or ######
- NO underline-style headings with === or ---
- Use **bold text** for emphasis and section labels instead
- Start all responses with content, never with a heading`

export default defineEventHandler(async (event) => {
  const { messages } = await readValidatedBody(event, z.object({
    model: z.string(),
    messages: z.array(z.custom<UIMessage>())
  }).parse)

  const lastMessage = messages[messages.length - 1]
  
  const userTextQuery = typeof lastMessage.parts === 'string' 
    ? lastMessage.parts 
    : (lastMessage.parts as any).text || ''

  let historicalContext = ""
  if (userTextQuery.trim().length > 0) {
    historicalContext = await getContextFromVectorDB(userTextQuery, 3)
  }

  const combinedInstructions = `${SYSTEM_PROMPT}\n\n====================================\nVERIFIED CONTEXT FROM YOUR HISTORICAL ERALNGEN WRITINGS:\n${historicalContext}\n====================================`

  const abortController = new AbortController()
  event.node.req.on('close', () => abortController.abort())

  const targetModelInstance = openai('gpt-4o')

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = streamText({
        abortSignal: abortController.signal,
        model: targetModelInstance,
        instructions: combinedInstructions,
        messages: await convertToModelMessages(messages),
        experimental_transform: smoothStream()
      })

      writer.merge(toUIMessageStream({
        stream: result.stream,
        sendSources: false,
        sendReasoning: true
      }))
    }
  })

  return createUIMessageStreamResponse({
    stream
  })
})
