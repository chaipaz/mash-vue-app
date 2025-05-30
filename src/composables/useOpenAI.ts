import axios from 'axios'
import { ref } from 'vue'

const cachedStory = ref<string | null>(null)

export const generateStory = async (prompt: string): Promise<string> => {
  if (cachedStory.value) {
    return cachedStory.value
  }

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  const url = 'https://api.openai.com/v1/chat/completions'

  if (!apiKey) {
    throw new Error('Missing VITE_OPENAI_API_KEY in your environment.')
  }

  const body =  {
    model: 'gpt-4o',
    messages: [ 
      { role: 'system', content: 'You are a creative fortune teller' },
      { role: 'user', content: prompt } ],
    temperature: 0.75,
    max_tokens: 1000,
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  } 

  try {
    const response = await axios.post(url, body, config)

    const story = response.data.choices?.[0]?.message?.content?.trim()
    if (!story) {
      throw new Error('No content returned from OpenAI')
    }

    cachedStory.value = story
    return story

  } catch (err: any) {
    console.error('Error calling OpenAI API:', err.response?.data || err.message)
    throw err
  }
}
