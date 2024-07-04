// server.js
const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');
const thirdPartyServerUrl = 'http://20.244.56.144/test/register'; // Replace with actual URL

const windowSize = 10;
const numbers = [];
const prevNumbers = [];

app.get('/numbers/:numberid', async (req, res) => {
  const numberId = req.params.numberid;
  try {
    // Fetch numbers from third-party server
    const response = await axios.get(`${thirdPartyServerUrl}/${numberId}`);
    const newNumber = response.data;
    
    // Update numbers array
    numbers.push(newNumber);
    
    // Limit numbers to window size
    if (numbers.length > windowSize) {
      numbers.shift();
    }

    // Calculate average
    const avg = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;

    // Prepare response
    const responseBody = {
      windowPrevState: [...prevNumbers],
      windowCurrState: [...numbers],
      numbers: [...numbers],
      avg: avg
    };

    // Update prevNumbers
    prevNumbers = [...numbers];

    res.json(responseBody);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching numbers');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

