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

app.post('/devices/', function(req, res){
    
    // Declaramos un objeto para almacenar el JSON que se recibe en el POST.
    var obj = JSON.parse(JSON.stringify(req.body));
    
    // Declaramos una variable para contar.
    var count = 0;

    // Y registramos la cantidad de keys que contiene el JSON en cuestión.
    for(var key in obj)
    {
        if(obj.hasOwnProperty(key))
        {
            count++;
        }
    }

    // En base a la cantidad de keys, sabemos si se modifica un actuador o si se agrega/edita un dispositivo.
    // En este primer caso, se modifica un actuador.
    if(count == 2)
    {
        // Este primer caso atiende un actuador del tipo switch.
        if(obj.hasOwnProperty("state"))
        {
            conexionMySql.query('UPDATE Devices SET state = ? WHERE id = ?', [req.body.state, req.body.id], function(err, respuesta){
                if(err) // Error en MySQL
                {
                    res.send(err).status(400);
                    return;
                }
                res.send("Se actualizó correctamente: " + JSON.stringify(respuesta)).status(200);
            });
        }
        // Este segundo caso atiende un actuador del tipo rango.
        else
        {
            conexionMySql.query('UPDATE Devices SET percent = ? WHERE id = ?', [req.body.percent, req.body.id], function(err, respuesta){
                if(err) // Error en MySQL
                {
                    res.send(err).status(400);
                    return;
                }
                res.send("Se actualizó correctamente: " + JSON.stringify(respuesta)).status(200);
            });
        }
    }
    
    // En este caso, la cuenta es superior a 2, por lo que se está agregando o editando un dispositivo.
    else if (count == 6)
    {
        conexionMySql.query('INSERT INTO Devices (name, description, state, type, percent, appliance) VALUES (?, ?, ?, ?, ?, ?)', [req.body.name, req.body.description, req.body.state, req.body.type, req.body.percent, req.body.appliance], function(err, respuesta){
            if(err) // Error en MySQL
            {
                res.send(err).status(400);
                return;
            }
            res.send("Se actualizó correctamente: " + JSON.stringify(respuesta)).status(200);
        });
    }

    else
    {
        console.log("Entre a la edición");
        conexionMySql.query('UPDATE Devices SET name = ?, description = ?, type = ?, appliance = ? WHERE id = ?', [req.body.name, req.body.description, req.body.type, req.body.appliance, req.body.id], function(err, respuesta){
            if(err) // Error en MySQL
            {
                res.send(err).status(400);
                return;
            }
            res.send("Se actualizó correctamente: " + JSON.stringify(respuesta)).status(200);
        });
    }
});

// Espera recibir algo del estilo {id: X}.
app.delete('/devices/', function(req, res){
    conexionMySql.query('DELETE FROM Devices WHERE id = ?', [req.body.id], function(err, respuesta){
        if(err) // Error en MySQL
        {
            res.send(err).status(400);
            return;
        }
        res.send("Se actualizó correctamente: " + JSON.stringify(respuesta)).status(200);
    });
});

// Se asocia la API de Express al puerto especificado.
app.listen(PORT, function(req, res) {
    console.log("¡NodeJS API corriendo correctamente!");
});

//=======[ End of file ]=======================================================
