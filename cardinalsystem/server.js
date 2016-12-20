'use strict';

var express = require('express');
var morgan  = require('morgan');
var session = require('express-session');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var config = require('config');
var path = require('path');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var assert = require('assert');
var cors = require('express-cors');
var MongoClient = require('mongodb').MongoClient;
var cruds = require('./lib/routes/cruds/index.js');
var login = require('./lib/routes/security/login.js');
var get   = require('./lib/routes/security/get.js');
var menus = require('./lib/routes/common/menus.js');
var alquiler  = require('./lib/routes/core/index.js');
var importador  = require('./lib/routes/importer/importador.js');
var callcenter  = require('./lib/routes/callcenter/callcenter.js');
var asignacion  = require('./lib/routes/asignacion/asignacion.js');
var cliente  = require('./lib/routes/cliente/cliente.carga.js');
var urlConnect = config.dbHost+"/"+config.db;
var favicon = require('serve-favicon');

var data;
MongoClient.connect(urlConnect, function(err, db) {
  if (err) { 
    throw err;
  }
  data = db;
});

var app = express();

app.use(morgan('dev'));
app.use(helmet());

app.use(cors(             //localhost:9009 172.16.8.54:3008
  { allowedOrigins: [config.allowedOrigins] }
));

var hora = 3600000;
var dia  = hora*24;


app.use(session({
	cookie: {
		maxAge: dia
	},
	secret: '123456',
	resave: false,
	saveUninitialized: true
}));

app.use(bodyParser.json({
  limit: '100mb'
}));
app.use(bodyParser.urlencoded({
	extended: true,
	limit: '100mb'
}));
app.use(cookieParser());


app.use(favicon(__dirname + '/dist/favicon.ico'));

app.engine(".html", ejs.__express);
app.set('views', __dirname + "/views");
app.use(express.static(__dirname + "/dist", {
  	index: "index.html",
	favicon: "favicon.ico"
}));



app.all('*',function(req, res, next){           //localhost:9009 172.16.8.54:3008  
    res.header('Access-Control-Allow-Origin', config.allowedOrigins);
    res.header("Access-Control-Allow-Credentials: true");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Routes
app.use('/', login);
app.use('/', get);
app.use('/', menus);
app.use('/', cruds);
app.use('/', alquiler);
app.use('/', importador);
app.use('/', callcenter);
app.use('/', asignacion);
app.use('/', cliente);


var port = process.env.PORT || config.port;

app.listen(port, function() {
  console.log('Ejecutando en el puerto ' + port);
});
