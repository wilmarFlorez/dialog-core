const OpenAIApi = require('openai')
const dotenv = require('dotenv')
const { prompts } = require('../shared/prompt')

dotenv.config()

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
})

if (!openai.apiKey) {
  console.log('API_KEY is not defined')
  throw new Error('API_KEY is not defined')
}

const getMessaggeChatGPT = async (prompt) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      ...prompts,
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'chatgpt-4o-latest',
    max_tokens: 90,
    temperature: 0,
    stop: 'END',
  })
  if (chatCompletion && chatCompletion.choices.length > 0) {
    return chatCompletion.choices[0].message.content
  }
  console.log('There is not message')
  return null
}

module.exports = {
  getMessaggeChatGPT,
}
