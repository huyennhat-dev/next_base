import { z } from 'zod'

const configSchema = z.object({
  API_URL: z.string(),
})

const configProject = configSchema.safeParse({
  API_URL: process.env.NEXT_PUBLIC_API_URL,
})
if (!configProject.success) {
  console.error(configProject.error.issues)
  throw new Error('The declared values in the .env file are invalid.')
}

const envConfig = configProject.data
export default envConfig