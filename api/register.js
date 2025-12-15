
// Vercel Serverless Function: Proxy for Registration
export default async function handler(req, res) {
  // Your AWS Server IP
  const AWS_SERVER_URL = 'http://13.231.95.36:5000/api/register';

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
