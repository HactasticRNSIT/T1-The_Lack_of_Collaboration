exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const message = body.message;

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing message in request body.' }),
      };
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing GOOGLE_API_KEY environment variable.' }),
      };
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/text-bison-001:generateText',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: {
            text: message,
          },
          temperature: 0.8,
          maxOutputTokens: 250,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data?.candidates?.[0]?.output || data?.output?.text || '' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Unknown error' }),
    };
  }
};
