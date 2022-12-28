const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

// Configure body-parser pour parser les données envoyées via le formulaire
app.use(bodyParser.json());

// Configure cookie-parser pour parser les cookies envoyés par le client
app.use(cookieParser());

// serve static files from the "public" directory
app.use(express.static('public'));

// the secret number to guess (between 0 and 100)
secretNumber = Math.floor(Math.random() * 100);
console.log(`Le nombre à deviner est : ${secretNumber}`);

// route to handle the form submission (POST request)
app.post('/guess', (request, response) => {
  const guess = request.body.guess;
  if (guess == secretNumber) {
    secretNumber = Math.floor(Math.random() * 100);
    console.log(`Le nombre à deviner est : ${secretNumber}`);
    response.json({
      message: 'Félicitations, vous avez deviné le nombre !',
      success: true,
    });
  } else {
    response.json({
      message: "Désolé, ce n'est pas le bon nombre.",
      success: false,
    });
  }
});

// route to display the home page (GET request)
app.get('/', (request, response) => {
  // Vérifie si le cookie "account" existe
  if (req.cookies.account) {
    response.sendFile(__dirname + '/public/index.html');
  } else {
    response.sendFile(__dirname + '/public/login.html');
  }
});

// start the server
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
