const express = require('express');
const app = express();
const PORT = 4000;


function getPrimes(n = 10) {
  const primes = [];
  let num = 2;
  while (primes.length < n) {
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(num);
    num++;
  }
  return primes;
}


function getFibonacci(n = 10) {
  const fib = [0, 1];
  while (fib.length < n) {
    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  }
  return fib.slice(0, n);
}


function getEven(n = 10) {
  const evens = [];
  for (let i = 1; evens.length < n; i++) {
    if (i % 2 === 0) evens.push(i);
  }
  return evens;
}


function getRandom(n = 10) {
  const randoms = [];
  for (let i = 0; i < n; i++) {
    randoms.push(Math.floor(Math.random() * 100) + 1);
  }
  return randoms;
}


app.get('/primes', (req, res) => {
  res.json({ numbers: getPrimes(10) });
});

app.get('/fibonacci', (req, res) => {
  res.json({ numbers: getFibonacci(10) });
});

app.get('/even', (req, res) => {
  res.json({ numbers: getEven(10) });
});

app.get('/rand', (req, res) => {
  res.json({ numbers: getRandom(10) });
});

app.listen(PORT, () => {
  console.log(`Mock Test Server running at http://localhost:${PORT}`);
});
