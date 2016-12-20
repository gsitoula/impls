  'use strict';

  var router = require('express').Router();
  var session = require('express-session');
  var crypto = require('crypto');
  var actDir = require('activedirectory');
  var config = require('config');
  var MongoClient = require('mongodb').MongoClient;
  var ObjectID = require('mongodb').ObjectID;
  var async = require('async');
  var sync = require('synchronize');
  var Sync = require('sync');
  var Promise = require('bluebird');
  var sql = require('mssql');
  var Sequelize = require('sequelize');
  var fs = require('fs');
  var readline = require('readline');
  var stream = require('stream');
  var multer = require('multer');
  var util = require('util')
  var exec = require('child_process').exec;
  var data_processor = require('./data_processor')

var urlConnect = config.dbHost+"/"+config.db;

var mongoConnection;
MongoClient.connect(urlConnect, function(err, db) {
	if (err) { 
		throw err;
	}
	mongoConnection = db;
});

router.post('/asignarCampana', (req, res, next) => {
	
	var guardar_asignacion = req.body;

	//console.log(guardar_asignacion.collection);
	
	data_processor(guardar_asignacion)
	.then((result) => {
		//res.status(200).send(result);
		
		mongoConnection.collection(guardar_asignacion.collection)
		  .save(result,
		  	(err, result) => {
		  		if(err) {
		  			throw err;
		  			return;
		  		} 
		  		res.status(200).send(result.result);
		  });
		
	});
});

module.exports = router;



	