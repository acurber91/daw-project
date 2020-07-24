/*=============================================================================
 * Authors: Agustin Bassi, Brian Ducca, Santiago Germino 
 * Date: Jul 2020
 * Licence: MIT
 * Project: DAW - CEIoT - Project Structure
 * Brief: Main backend file
=============================================================================*/

//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var mysql   = require('./mysql-connector');

// para parsear application/json
app.use(express.json()); 
// para servir archivos estaticos
app.use(express.static('.')); 

//=======[ Main module code ]==================================================

app.get('/', function(req, res, next) {
    response = "{ 'key1':'value1' }"
    res.send(JSON.stringify(response)).status(200);
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API working on port: " + PORT);
});

//=======[ End of file ]=======================================================
