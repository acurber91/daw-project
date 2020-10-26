/*=============================================================================
 * Authors: Agustin Bassi, Brian Ducca, Santiago Germino 
 * Date: Jul 2020
 * Licence: GPLV3+
 * Project: DAW - CEIoT - Project Structure
 * Brief: Main backend file
=============================================================================*/

//=======[ Settings, Imports & Data ]==========================================
// Puerto donde se levantará la API de Express.
var PORT = 3000;
// Para levantar Express, importamos su módulo.
var express = require('express');
var app = express();
var mysql = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));
// Conexión a la base de datos.
var conexionMySql = require('./mysql-connector');

//=======[ Main module code ]==================================================

app.get('/devices/', function(req, res, next) {
    conexionMySql.query('SELECT * FROM Devices', function(err, respuesta){
        if(err) // Error en MySQL
        {
            res.send(err).status(400);
            return;
        }
        res.send(respuesta);
    });
});

app.get('/devices/:id', function(req, res, next) {
    conexionMySql.query('SELECT * FROM Devices WHERE id = ?', [req.params.id], function(err, respuesta){
        if(err) // Error en MySQL
        {
            res.send(err).status(400);
            return;
        }
        res.send(respuesta);
    });
})

// Espera recibir algo del estilo {id: X, state: X, percent: X}.
app.post('/devices/', function(req, res){
    var obj = JSON.parse(JSON.stringify(req.body));
    if(obj.hasOwnProperty("state"))
    {
        conexionMySql.query('UPDATE Devices SET state = ? WHERE id = ?', [req.body.state, req.body.id], function(err, respuesta){
            if(err) // Error en MySQL
            {
                res.send(err).status(400);
                return;
            }
            //res.send("Se actualizó correctamente: " + JSON.stringify(respuesta)).status(200);
            res.send("Se recibió: " + JSON.stringify(respuesta)).status(200);
        });
    }
    else if (obj.hasOwnProperty("percent"))
    {
        conexionMySql.query('UPDATE Devices SET percent = ? WHERE id = ?', [req.body.percent, req.body.id], function(err, respuesta){
            if(err) // Error en MySQL
            {
                res.send(err).status(400);
                return;
            }
            //res.send("Se actualizó correctamente: " + JSON.stringify(respuesta)).status(200);
            res.send("Se recibió: " + JSON.stringify(respuesta)).status(200);
        });
    }
});

// Se asocia la API de Express al puerto especificado.
app.listen(PORT, function(req, res) {
    console.log("¡NodeJS API corriendo correctamente!");
});

//=======[ End of file ]=======================================================
