const express = require('express');
const axios = require('axios');
const app = express();

const PORT = 3000;

app.get('/ping', async (req, res) => {
  res.send('pong');
});

app.get('/spaceflight_news', async (req, res) => {

    const apiUrl = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=5';

    axios.get(apiUrl)
    .then(response => {
        const titles = response.data.results.map(article => article.title);
        console.log(titles)
        res.send(titles);
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });

  
});

app.get('/dictionary', (req, res) => {
    // Obtener el valor del parámetro 'word' de la consulta
    const word = req.query.word;

    if (!word) {
        return res.status(400).send('Error: Debes proporcionar un valor para el parámetro "word"');
      }

    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    axios.get(apiUrl)
    .then(response => {
        console.log(response.data);
        const phonetics = response.data.map(article => {
            // Obtener los significados y fonéticas de cada artículo
            const meanings = article.meanings;
            const phonetics = article.phonetics;
          
            // Concatenar los significados y fonéticas
            const meaningsAndPhonetics = meanings.map(meaning => {
              return {
                meanings: meaning,
                phonetics: phonetics
              };
            });
          
            return meaningsAndPhonetics;
          });
        res.send(phonetics);
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
  });

  app.get('/quote', async (req, res) => {

    const apiUrl = 'https://api.quotable.io/random';

    axios.get(apiUrl)
    .then(response => {
        const phrase = response.data.content;
        console.log(phrase)
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