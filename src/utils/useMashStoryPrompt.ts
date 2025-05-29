export const generatePrompt = (results: { category: string; choice: string }[]) => {
  const mash = results.find(res => res.category.toLowerCase() === 'mash')?.choice ?? 'mystery place'

  const otherLines = results
    .filter(res => res.category.toLowerCase() !== 'mash')
    .map(({ category, choice }) => {
      const article = /^[aeiou]/i.test(choice) ? 'an' : 'a'
      return `- Your ${category.toLowerCase()} will be ${article} ${choice}.`
    })

  return `
Write a fun and imaginative MASH story based on the following information::

- You will live in a ${mash}.
${otherLines.join('\n')}

Make it entertaining like a children's fortune-telling game. Keep it short and engaging.
`.trim()
}
