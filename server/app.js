const express = require('express');
const cors = require("cors");
const configRoutes = require('./routes');
const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
configRoutes(app);

const http = require('http').createServer(app);
http.listen(port, () => {
    console.log(`Listening on port ${port}`);
    }
);
