'use strict';

var router = require('express').Router();
var session = require('express-session');
var crypto = require('crypto');
var actDir = require('activedirectory');
var config = require('config');
var MongoClient = require('mongodb').MongoClient;
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

var urlConnect = config.dbHost+"/"+config.db;

var mongoConnect;
MongoClient.connect(urlConnect, function(err, db) {
	if (err) { 
		throw err;
	}
	mongoConnect = db;
});

var configAD = {
	url: 'ldap://' + config.adUrl,
	baseDN: 'dc=' + config.dcd + ',dc=' + config.dce,
	username: config.username + '@' + config.domain,
	password: config.password
};
var ad = new actDir(configAD);



router.get('/userData', function(req, res) {

	//console.log(req.query.token);
	
	if (!req.session.user) {
		return res.status(401).send({
			code: 404,
			descripcion: "Su sesion a caducado"
		});
	}

	if (req.session.user.token !== req.query.token) {
		return res.status(401).send({
			code: 401,
			descripcion: "Autenticidad de Token Invalida"
		});
	}
	
	mongoConnect.collection('profiles').find({name: req.session.user.profile}).toArray(function(err, result) {
		//console.log(result);
		
		var getApps = function(arr) {
			
				//var objUser = {};
			 	var apps = [];

			arr.forEach(function(currentValue) {
				//res.status(200).send(currentValue.appDisp);
				apps.push(currentValue.appDisp);
			});
			return apps;
		}

		res.status(200).send(getApps(result));	
	});
});




router.get('/getOperadores', function(req, res) {
	
	var objOpe = {};

	ad.getUsersForGroup('Operadores', function(err, users) {
		
		if(err) console.log(err);
			if(!users) console.log("Grupo " + currGroup + " no existe");
				else {
					//console.log(users);
					objOpe.users = users;
					data.collection('profiles').find({name: 'Operadores'}).toArray(function(err, result) {
						//console.log(result[0].appDisp);
						objOpe.apps = result[0].appDisp;
						res.status(200).send(objOpe);
					});	
				}	
	});

});




router.get('/getGroupUsers', function(req, res) {

	/*
		El servicio comienza buscando los grupos que se encuentran en la Base de Datos,
		luego de encontrarlos realiza en Active Directory una busqueda de usuarios
		de estos grupos. Cada usuario es guardado en su correspondiente grupo en la Base de Datos.
		La respuesta realizada al final es una busqueda de los grupos, usuarios y aplicaciones encontradas
		en un documento de la Base de Datos.
	*/

	data.collection('groups').find().toArray(function(err, result) {
		if(err){
			console.log(err);
			return;
		} else {
			console.log('Buscando Grupos en DB ...');

			result[0].grupos.forEach(function(currGroup) {
				//console.log(currGroup);
				ad.getUsersForGroup(currGroup, function(err, users) {
					if(err) console.log(err);
						if(!users) console.log("Grupo " + currGroup + "no existe en Active Directory");
					 else {
					 	//console.log(users);				
						
					 	users.forEach(function(currUser) {
					 		//console.log(currUser);
					 		data.collection('grupos').find({grupo: currGroup}).toArray(function(err, result) {
					 			//console.log({ grupos: currGroup , usuarios: result[0].appDisp});
					 			
					 			
					 			if(result[0].usuarios.length == 0) {
									data.collection('grupos').update({
										grupo: currGroup
									},{
										$addToSet:{
											usuarios: {
												name: currUser.cn,
												grupo: currGroup,
												appDisp: result[0].appDisp
											}
										}
									}, { upsert: true });
								} 
									
								if(result[0].usuarios.length > 0) {
									data.collection('grupos').update({
										grupo: currGroup
									},{
										$addToSet:{
											usuarios: {
												name: currUser.cn,
												grupo: currGroup,
												appDisp: result[0].appDisp 
											}
										}
									}, { upsert: true });
								}
								
					 		});
					 	});
						
					}
				});
			});
			
			data.collection('grupos').find().toArray(function(err, result) {
			if(err) console.log(err);
			 else {
			 	//console.log(result);
			 	var getUsers = function(arr) {
			 		
			 		var objUser = {};
			 		var user = [];	

				 	arr.forEach(function(currVal) {
				 		objUser.grupo = currVal.grupo;
				 		objUser.usuarios = currVal.usuarios; 
				 		objUser.aplicaciones = currVal.appDisp;
				 		user.push(objUser);
				 		objUser = {};
				 	});
				 	return user;
			 	};

			 	res.status(200).send(getUsers(result));
			 }
			});
		}

	});
});


router.get('/getClientsTango', function(req, res, next){
	//res.status(200).send(mssql);
	var sequelize = new Sequelize('utelser', 'join', 'join1234J', {
		host: '172.16.8.13',
		port: 54422,
		dialect: 'mssql',
		pool: {
    		max: 5,
    		min: 0,
    		idle: 10000
  		},
	});
  	
  	data.collection('clientes_sinc_t').drop();

  	sequelize.query("SELECT * FROM GVA14").spread(function(results, metadata) {
  		console.log(results[0]);
  		//res.status(200).send(results[0]);
  		//console.log(metadata);

  		var obj_registro = {};
  		var arr_registros = [];

  		results.forEach(function(currRegistro) {

  			//console.log(results);
  			
  			obj_registro.C_POSTAL = currRegistro.C_POSTAL;
  			obj_registro.COD_CLIENT = currRegistro.COD_CLIENT;
  			obj_registro.CUIT = currRegistro.CUIT;
  			obj_registro.DIR_COM = currRegistro.DIR_COM;
  			obj_registro.DOMICILIO = currRegistro.DOMICILIO;
  			obj_registro.E_MAIL = currRegistro.E_MAIL;
  			obj_registro.LOCALIDAD = currRegistro.LOCALIDAD;
  			obj_registro.NOM_COM = currRegistro.NOM_COM;
  			obj_registro.RAZON_SOCI = currRegistro.RAZON_SOCI;

  			arr_registros.push(obj_registro);
  			
  			data.collection('clientes_sinc_t').save(obj_registro, function(err, result){
  				//console.log(result);
  				if(err){
  					console.log(err);
  					res.status(501).send({status:501, descripcion: "Ocurrio un error durante la sincronización.", error: err});
  					return;
  				}
  			});
  			
  			obj_registro = {};
  		});
  		//res.status(200).send(arr_registros);
  		res.status(200).send({status:200, descripcion: "Sincronización Finalizada.", total_registros: arr_registros.length, registros: arr_registros});
  });		
});


module.exports = router;
