const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const app = express();

// mysql
// mysql://:95fbacbe@us-cdbr-east-05.cleardb.net/heroku_146ae20a624b8e1?reconnect=true
const connection = mysql.createConnection({
    host: 'heroku_146ae20a624b8e1',
    user: 'b1d1f51bccf20d',
    password: '95fbacbe',
    database: 'us-cdbr-east-05.cleardb.net'
});

// swagger
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Pruebas MeLi",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:4000"
            }
        ]
    },
    apis: [`${path.join(__dirname, "./routes/*.js")}`]
}

// settings
app.set('port', process.env.PORT || 4000);

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// routes
app.use(require('./routes'));
app.use('/api/mutant', require('./routes/mutant'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerSpec)));

// starting the server
app.listen((process.env.PORT || 5000), function(){
    console.log('listening on *:5000');
  });
/*app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});*/
