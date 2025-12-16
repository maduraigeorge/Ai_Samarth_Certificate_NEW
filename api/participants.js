
// Vercel Serverless Function: Proxy for Fetching Participants (Admin)
export default async function handler(req, res) {
  // Use Environment Variable or Fallback
  // CORRECTED IP: 13.231.95.36 (was 13.232...)
  const baseUrl = process.env.BACKEND_URL || 'http://13.232.90.36:5000';

  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const AWS_SERVER_URL = `${cleanBaseUrl}/api/participants`;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(AWS_SERVER_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle non-JSON responses (e.g., 404 HTML from Express or 502 Bad Gateway)
    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        console.error("Backend returned non-JSON:", text);
        return res.status(response.status || 500).json({ 
            error: `Backend error: Received invalid response from server (${response.status}). Ensure server.js is updated and running.` 
        });
    }

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Failed to connect to backend server. Please check BACKEND_URL configuration and EC2 status.' });
  }
}
