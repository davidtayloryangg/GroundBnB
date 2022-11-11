const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//TODO Configure routes

const http = require('http').createServer(app);
http.listen(port, () => {
    console.log(`Listening on port ${port}`);
    }
);
