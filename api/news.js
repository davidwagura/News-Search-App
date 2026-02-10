// api/news.js

export default async function handler(request, response) {
  const { q, lang = 'en', country = 'us', max = 10 } = request.query;
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'API key not configured' });
  }

  let url;
  if (q) {
    url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=${lang}&max=${max}&token=${apiKey}`;
  } else {
    url = `https://gnews.io/api/v4/top-headlines?lang=${lang}&country=${country}&max=${max}&token=${apiKey}`;
  }

  try {
    const fetchResponse = await fetch(url);
    const data = await fetchResponse.json();
    
    // GNews returns 'articles' array
    return response.status(200).json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return response.status(500).json({ error: 'Failed to fetch news' });
  }
}
