'use strict';

var router = require('express').Router();
var session = require('express-session');
var crypto = require('crypto');
var config = require('config');
var MongoClient = require('mongodb').MongoClient;
var urlConnect = config.dbHost+"/"+config.db;

var data;
MongoClient.connect(urlConnect, function(err, db) {
  if (err) { 
    throw err;
  }
  data = db;
});

router.get('/getMenus', function(req, res) {

	if (!req.session.user) {
		return res.status(401).send({
			code: 404,
			descripcion: "Su sesion a caducado"
		});
	};

	console.log(req.query.menu);
	

	data.collection('menus').find({profile: req.session.user.profile, name: req.query.menu}).toArray(function(err, result) {
		//console.log(result);
		//console.log("resultado encontrado");	
		res.status(200).send(result);
		/*
		result.forEach(function(currentValue) {
			//console.log(currentValue);
			res.status(200).send(currentValue);
		});
		*/
	});
});

module.exports = router;
