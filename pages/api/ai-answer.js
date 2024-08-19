// pages/api/ai-answer.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { question } = req.body;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000', // Optional
          'X-Title': 'Flashcard SaaS', // Optional
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3-8b-instruct:extended',
          messages: [
            { role: 'user', content: question },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API request failed with status ${response.status}: ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('AI Response:', data); // For debugging

      // Ensure the response has the expected structure
      if (data.choices && data.choices.length > 0) {
        res.status(200).json({ answer: data.choices[0].message.content || 'No answer generated' });
      } else {
        res.status(200).json({ answer: 'No answer generated' });
      }
    } catch (error) {
      console.error('Error fetching answer:', error);
      res.status(500).json({ error: 'Failed to fetch answer' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
