const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const WS = require('ws');
const ReconnectingWebSocket = require('reconnecting-websocket');
const request = require('request');
const axios = require('axios');

// Variables d'environnement
const nodeRPC = process.env.noderpc;
const nodeWallet = process.env.nodewallet;
const nodeWS = process.env.nodews;

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
  if (request.cookies.account) {
    response.sendFile(__dirname + '/public/index.html');
  } else {
    response.sendFile(__dirname + '/public/login.html');
  }
});

app.get('/login', (req, res) => {
  
  // Affiche les paramètres de la requête GET dans la console
  console.log(req.query);

  // Si l'action demandée est "create"
  if (req.query['action'] == "create") {
  
    // Définition des options de la requête POST à envoyer
    const options = {
    url: nodeRPC,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'account_create',
      wallet: nodeWallet
    })
  };

  // Envoi de la requête POST et gestion de la réponse
  request(options, (error, response, body) => {
    if (error) {
      console.log("error")
    } else {
      const body = response.body;
      const data = JSON.parse(body);
      res.json(data); // Envoie la réponse
      console.log(data) // Affiche le résultat
    }
  });
} 

  if (req.query['action'] == "verify") {
    const add = req.query['account']
    if (req.query['account'].substring(0, 4) == "xdg_") {
      
      const ws = new ReconnectingWebSocket(nodeWS, [], {
        WebSocket: WS,
        connectionTimeout: 1000,  
        maxRetries: 100000,
        maxReconnectionDelay: 2000,
        minReconnectionDelay: 10 // if not set, initial connection will take a few seconds by default
      });

      // As soon as we connect, subscribe to block confirmations
      ws.onopen = () => {
        const confirmation_subscription = {
          "action": "subscribe", 
          "topic": "confirmation",
          "options": { "accounts": [add] }
        }
        ws.send(JSON.stringify(confirmation_subscription));

        // Other subscriptions can go here
      };

      // The node sent us a message
      ws.onmessage = msg => {
        data_json = JSON.parse(msg.data);
        if (data_json.topic === "confirmation") {
          data = data_json["message"]
          data = data["account"]
          if (data != add) {
            data = { "account": data }
            console.log(data);
            res.json(data);
	    ws.close();
          }
        }

      };


      setTimeout(function close() {
        
	try {
          ws.send('un message');
          console.log('La connection WebSocket est ouverte');
          ws.close();
        } catch (error) {
          console.log('La connection WebSocket est fermée');
        }
      }, 60000);

    } else { console.log("Yes"); }

  }

});

// start the server
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
