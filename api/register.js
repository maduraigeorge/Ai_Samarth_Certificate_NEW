
// Vercel Serverless Function: Proxy for Registration
export default async function handler(req, res) {
  // Use Environment Variable set in Vercel Dashboard
  const baseUrl = process.env.BACKEND_URL;

  if (!baseUrl) {
    console.error("Configuration Error: BACKEND_URL environment variable is not set.");
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Construct the full URL
  // We ensure we don't end up with double slashes if the env var has a trailing slash
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const AWS_SERVER_URL = `${cleanBaseUrl}/api/register`;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(AWS_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Failed to connect to backend server' });
  }
}
