/*=============================================================================
 * Author: Agustín Curcio Berardi based on the example project written by 
   Agustin Bassi, Brian Ducca and Santiago Germino.
 * Date: October 2020
 * Licence: GPLV3+
 * Project: Trabajo Práctico Final - DAW - CEIoT
 * Brief: Main backend implementation.
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

// Direccionamiento para solicitudes HTTP del tipo GET.
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

// Direccionamiento para solicitudes HTTP del tipo GET con envío de datos a través de la URI.
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

// Direccionamiento para solicitudes HTTP del tipo GET.
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

    // En base a la cantidad de keys que contiene el archivo JSON, sabemos si se modifica un actuador o si se agrega/edita un dispositivo.
    switch(count)
    {
        // Si el JSON contiene dos keys, se trata de un cambio en un switch o slider.
        case(2):
        {
            // Este primer caso atiende el caso del switch.
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
            // Este primer caso atiende el caso del slider.
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
            break;
        }
        // Si el JSON contiene cinco keys, se trata de una edición de un dispositivo existente.
        case(5):
        {
            conexionMySql.query('UPDATE Devices SET name = ?, description = ?, type = ?, appliance = ? WHERE id = ?', [req.body.name, req.body.description, req.body.type, req.body.appliance, req.body.id], function(err, respuesta){
                if(err) // Error en MySQL
                {
                    res.send(err).status(400);
                    return;
                }
                res.send("Se actualizó correctamente: " + JSON.stringify(respuesta)).status(200);
            });
            break;
        }
        // Por último, si el JSON contiene seis keys, se trata de una adición de nuevo dispositivo.
        case(6):
        {
            conexionMySql.query('INSERT INTO Devices (name, description, state, type, percent, appliance) VALUES (?, ?, ?, ?, ?, ?)', [req.body.name, req.body.description, req.body.state, req.body.type, req.body.percent, req.body.appliance], function(err, respuesta){
                if(err) // Error en MySQL
                {
                    res.send(err).status(400);
                    return;
                }
                res.send("Se actualizó correctamente: " + JSON.stringify(respuesta)).status(200);
            });
            break;
        }
        default:
        {
            break;
        }
    }
});

// Direccionamiento para solicitudes HTTP del tipo DELETE.
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
