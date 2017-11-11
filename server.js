#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const POST_PORT = argv.postPort || 3000;
const GET_PORT = argv.getPort || 8000;
const STATIC_FILE_DIRECTORY = argv.staticDir || path.join(__dirname, 'public');

let dataStore = {};
let app = {};

app['GET'] = express();
app['POST'] = express();

app['GET'].use(express.static(STATIC_FILE_DIRECTORY));

app['POST'].use(bodyParser.urlencoded({ extended: false }));
app['POST'].use(bodyParser.json());

app['GET'].get('/api/*', (req, res) => {
    let requestPath = req.path.replace('/api', '');
    let dataOnRequestedPath = dataStore[requestPath];
    if(dataOnRequestedPath){
        res.send(dataOnRequestedPath);
    } else {
        res.status(404);
        res.send();
    }
});

app['POST'].post('*', (req, res) => {
    dataStore[req.path] = req.body;
    res.send();
});

const startApp = function(appName, appPort){
    app[appName].server = app[appName].listen(appPort);
};

const stopApp = function(appName){
    app[appName].server.close();
};

app['close'] = function(){
    stopApp('GET');
    stopApp('POST');
};

startApp('GET', GET_PORT);
startApp('POST', POST_PORT);

console.log(`Server Started`);
console.log(`Listening for POSTs on port ${POST_PORT}`);
console.log(`Listening for GETs on port ${GET_PORT}`);
console.log(`Serving static files from ${STATIC_FILE_DIRECTORY}`);

module.exports = app;
