const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse request bodies as JSON
app.use(bodyParser.json());

// serve static files from the "public" directory
app.use(express.static('public'));

// the secret number to guess (between 0 and 100)
const secretNumber = Math.floor(Math.random() * 100);

// route to handle the form submission (POST request)
app.post('/guess', (request, response) => {
  const guess = request.body.guess;
  if (guess == secretNumber) {
    response.send(`
      <h1 class="success">Félicitations, vous avez deviné le nombre !</h1>
      <p>Le nombre était en effet ${guess}.</p>
      <a href="/">Rejouer</a>
    `);
  } else {
    response.send(`
      <h1 class="error">Désolé, ce n'est pas le bon nombre.</h1>
      <p>Veuillez réessayer :</p>
      <form method="POST" action="/guess">
        <input type="number" name="guess">
        <button type="submit">Envoyer</button>
      </form>
    `);
  }
});

// route to display the home page (GET request)
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
});

// start the server
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});

