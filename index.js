var express = require('express');
var app = express();
var cors = require('cors');

const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

const router = require('./router.js');
app.use('/api', router);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)
);