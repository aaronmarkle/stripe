var express = require('express');
var app = express();
var stripe = require("stripe")("sk_test_1lDtXzhlhwCx49hSRDnHJIin");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.use('/', express.static(__dirname + '/'));

app.post('/creditAuth', jsonParser, function(req, res) {
  console.log(req.body);
  var stripeToken = req.body.stripeToken;
  var charge = stripe.charges.create({
    amount: 1000, // amount in cents, again
    currency: "usd",
    source: stripeToken,
    description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
    // The card has been declined
    console.log('The card has been declined.');
    }
  });
});

app.listen(8080);
console.log('Server is live on port 8080.');