export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { category } = req.body;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3-8b-instruct:extended',
          messages: [
            { role: 'user', content: `Generate flashcards for ${category}` },
          ],
        }),
      });

      // Log the full response for debugging
      const responseText = await response.text();
      console.log('Full API Response:', responseText);

      // If the response content is not JSON, handle it accordingly
      try {
        // Assuming the content might be plain text or a different format
        const flashcards = responseText; // Here you might need to parse or process the text

        res.status(200).json({ flashcards });
      } catch (parseError) {
        console.error('Error processing response:', parseError);
        res.status(500).json({ error: 'Error processing response' });
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      res.status(500).json({ error: 'Failed to fetch flashcards' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
