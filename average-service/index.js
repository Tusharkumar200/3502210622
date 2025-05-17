const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Sliding window storage and size
let windowStore = [];
const WINDOW_SIZE = 10;

// External API URLs (pointing to the mock test server)
const testServerURLs = {
  p: 'http://localhost:4000/primes',
  f: 'http://localhost:4000/fibonacci',
  e: 'http://localhost:4000/even',
  r: 'http://localhost:4000/rand'
};

// Fetch numbers from external API with 500ms timeout
async function fetchNumbers(type) {
  const url = testServerURLs[type];
  try {
    const response = await axios.get(url, { timeout: 500 });
    return response.data.numbers || [];
  } catch (error) {
    // Ignore timeout or errors
    return [];
  }
}

// GET /numbers/:numberid endpoint
app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;

  if (!['p', 'f', 'e', 'r'].includes(numberid)) {
    return res.status(400).json({ error: 'Invalid numberid. Use p, f, e, or r.' });
  }

  const windowPrevState = [...windowStore];

  // Fetch new numbers
  const fetchedNumbers = await fetchNumbers(numberid);

  // Filter unique numbers not already in the window
  const newNumbers = fetchedNumbers.filter(num => !windowStore.includes(num));

  // Add new numbers with FIFO logic
  for (const num of newNumbers) {
    if (windowStore.length >= WINDOW_SIZE) {
      windowStore.shift(); // remove oldest number
    }
    windowStore.push(num);
  }

  // Calculate average of current window
  const avg = windowStore.length
    ? windowStore.reduce((sum, n) => sum + n, 0) / windowStore.length
    : 0;

  res.json({
    windowPrevState,
    windowCurrState: [...windowStore],
    numbers: newNumbers,
    avg: parseFloat(avg.toFixed(2))
  });
});

app.listen(PORT, () => {
  console.log(`Average Calculator Service running at http://localhost:${PORT}`);
});
