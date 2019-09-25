const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app;
const router;
const port = 3000;

app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());

router = express.Router();

router.get('/public_things', function(req, res) {
   res.json({"message": "Here are the public things..."});
});

app.use('/api', router);

app.listen(port, function() {
    console.log('Web server listening on localhost:' + port);
});