var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app;
var router;
var port = 3000;

app = express();

app.use(morgan('combined')); //logger
app.use(bodyParser.json());

router = express.Router();

router.get('/public_things', function(req, res) {
   res.json({"message": "Here are the public things..."});
});

app.use('/api', router);

app.listen(port, function() {
    console.log('Web server listening on localhost:' + port);
});