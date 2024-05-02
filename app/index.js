const express = require('express');
const redis = require('redis');
const axios = require('axios');
const hotshot = require('hot-shots');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 3000;

// RATE LIMITING setup
const windowSizeInSeconds = 1;
const allowedRequestsPerWindow = 1000;
const limiter = rateLimit({windowMs: windowSizeInSeconds * 1000, limit: allowedRequestsPerWindow});
app.use(limiter);

// REDIS setup
const redisClient = redis.createClient({url: 'redis://redis:6379'});
(async () => await redisClient.connect())();

// HOTSHOT setup
const statsdClient = new hotshot({host: 'graphite', port: 8125});

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    sendDuration(duration, 'endpoint.response_time');
  });

  next();
});

const sendDuration = (duration, metricName) => {
    const durationInMilliseconds = duration[0] * 1000 + duration[1] / 1e6;
    statsdClient.timing(metricName, durationInMilliseconds);
}

// ENDPOINTS
app.get('/ping', async (req, res) => {
  res.send('pong');
});

app.get('/spaceflight_news', async (req, res) => {

    let titles = [];
    const titlesString = await redisClient.get('space_news');

    if(titlesString !== null) {
        titles = JSON.parse(titlesString);
        res.send(titles);
    } else {
        const start = process.hrtime();

        axios.get('https://api.spaceflightnewsapi.net/v4/articles/?limit=5')
        .then(async(response) => {
          const duration = process.hrtime(start);
          sendDuration(duration, 'remote_api.response_time');
          titles = response.data.results.map(article => article.title);
          console.log(titles)
          await redisClient.set('space_news', JSON.stringify(titles), {EX: 5});
          res.send(titles);
        })
        .catch(error => {
          console.error('Error al obtener los datos:', error);
      });
    }
  
});

app.get('/dictionary', (req, res) => {

    const word = req.query.word;

    if (!word) {
        return res.status(400).send('Error: Debes proporcionar un valor para el parámetro "word"');
      }

    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    const start = process.hrtime();
    axios.get(apiUrl)
    .then(response => {
        const duration = process.hrtime(start);
        sendDuration(duration, 'remote_api.response_time');
        
        const data = response.data;

        let phonetics = [];
        let meanings = [];

        if (Array.isArray(data) && data.length > 0) {
          data.forEach(entry => {
            phonetics.push(...entry.phonetics.map(entry => entry));
            meanings.push(...entry.meanings.map(entry => entry));
          });
        }

      const wordInfo = {
        phonetics: phonetics,
        meanings: meanings
      };
        
      res.send(wordInfo);
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
  });

  app.get('/quote', async (req, res) => {

    const apiUrl = 'https://api.quotable.io/random';

    const start = process.hrtime();
    axios.get(apiUrl)
    .then(response => {
        const duration = process.hrtime(start);
        sendDuration(duration, 'remote_api.response_time');
        const phrase = response.data.content;
        res.send(phrase);
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });

});

  

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
  });