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
    amount: req.body.amount * 100, // amount in cents
    currency: "usd",
    source: stripeToken,
    description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      res.json({errorMsg: 'There was an error processing your request.'});
    } else {
      res.json({successMsg: 'The charge went through successfully.'});
    }
  });
});

app.listen(8080);
console.log('Server is live on port 8080.');