
// Vercel Serverless Function: Proxy for Registration
export default async function handler(req, res) {
  // Use Environment Variable or Fallback to known IP
  const baseUrl = process.env.BACKEND_URL || 'http://13.231.95.36:5000';

  // Remove trailing slash if present
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

    // Check if the response from AWS is valid JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
       throw new Error(`Invalid response from backend: ${response.statusText}`);
    }

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Failed to connect to backend server. Please check BACKEND_URL configuration.' });
  }
}
