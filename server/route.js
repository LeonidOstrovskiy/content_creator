import express from 'express';

import fetch from 'node-fetch';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { role, topic } = req.body.data;

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Please compose an article in relation with the following topic: ${topic}`,
          },
        ],
        max_tokens: 100,
      }),
    };

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      options
    );
    const responseJson = await response.json();
    // console.log(responseJson);
    res.status(200).json({ msg: responseJson });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/getimage', async (req, res) => {
  try {
    const { topic } = req.body.data;

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: topic,
        n: 1,
        size: '512x512',
      }),
    };

    const response = await fetch(
      'https://api.openai.com/v1/images/generations',
      options
    );
    const responseJSON = await response.json();

    res.status(200).json({ msg: responseJSON });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
