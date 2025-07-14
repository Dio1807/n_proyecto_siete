const express = require('express');
const cors = require('cors');
const db = require('../db/connection');

const path =require('path');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersR = '/api/usuarios';
        this.empresasR = '/api/empresas';
        this.autentificacionR = '/api/auth';
        this.rolesR = '/api/roles';
        this.periodosR = '/api/periodos';
        this.salasR = '/api/crearsalas'; // de salas paso 4 03/06/2025
        this.ingresarsalasR = '/api/ingresarsalas'; // de detallesalas paso 4 03/06/2025
        this.reportesR = '/api/reportes'; // rutas de reportes
        this.reportesR = '/api/reportes'; // rutas de reportes
        this.dbConnection();
        this.middleware();

        this.routes();

        //FIXME: Todavia no mostre
       
       
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log("Base de Datos en linea");
        } catch (error) {
            throw new Error(error);
        }
    }

    middleware(){
        this.app.use( cors() );
        this.app.use( express.json() );
    }
       
    routes() {
        this.app.use(this.usersR, require('./../routes/users'));
        this.app.use(this.empresasR, require('./../routes/empresas'));
        this.app.use(this.autentificacionR, require('./../routes/auth'));
        this.app.use(this.rolesR, require('./../routes/roles'));
        this.app.use(this.periodosR, require('./../routes/periodos'));
        this.app.use(this.salasR, require('./../routes/RoutesSala')); // de salas paso 4 03/06/2025
        this.app.use(this.ingresarsalasR, require('./../routes/RoutesIngresarSala')); // de detallesalas paso 4 03/06/2025
        this.app.use(this.reportesR, require('./../routes/reportes')); // rutas de reportes
        this.app.use(this.reportesR, require('./../routes/reportes')); // rutas de reportes
    }

    

    listen() {
        this.app.listen(this.port, () => { console.log(`Escuchando en: ${this.port}`); });
    }
}
module.exports = Server;
