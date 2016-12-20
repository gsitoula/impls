'use strict';

var router = require('express').Router();
var session = require('express-session');
var crypto = require('crypto');
var actDir = require('activedirectory');
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

var configAD = {
	url: 'ldap://' + config.adUrl,
	baseDN: 'dc=' + config.dcd + ',dc=' + config.dce,
	username: config.username + '@' + config.domain,
	password: config.password
};
var ad = new actDir(configAD);

router.post('/login', function(req, res) {
	
	var username = req.body.username + '@' + config.domain;
	var userbase = req.body.username;
	var pass = req.body.password;
	var hash = crypto.createHash('md5').update(username + Date.now()).digest('hex');
	//Validacion Active Directory
   	if(config.tipoAuth.ad){

	ad.authenticate(username, pass, function(err, auth) {

		if (err) {
			console.log(err);
			res.status(501).json({
				err: 1,
				descripcion: "Usuario y/o Contraseña Invalido",
				err_data: err.name,
				mensaje: err
			})
			return;
		}

		if (!auth) {
			res.status(501).send({
				err: 1,
				descripcion: "Ha ocurrido un error durante la Autenticacion de sus Credenciales"
			});
			return;
		}

		ad.getGroupMembershipForUser(userbase, function(err, groups) {
			if (err) {
				console.log('ERROR: ' + JSON.stringify(err));
				return;
			}
			if (!groups) {
				console.log('User: ' + username + "not found.");
			} else {
				
				//console.log(groups[0].cn);
				/*
				data.collection('grupos').find({grupo: groups[0].cn}).toArray(function(err, result) {
					if(err){
						console.log(err);
						res.status(501).send(err);
					} else {
						//console.log(result[0]);
						
						console.log("encontro al grupo de Ad en mongo");

							console.log("Matchea al grupo");
							//console.log(result[0].usuarios);
							
							if(result[0].usuarios.length == 0) {
								console.log("no hay usuarios en la db");
								data.collection('grupos').update({
										grupo: groups[0].cn
									},{
										$push:{
											usuarios: {
												name: userbase,
												grupo: groups[0].cn 
											}
										}
									});

							} else {

								result[0].usuarios.forEach(function(currUser) {
									if(currUser.name == userbase) {
										console.log("Usuario ya existente en db");
										return;
									} else {
										data.collection('grupos').update({
											grupo: groups[0].cn
										},{
											$push:{
												usuarios: {
													name: userbase,
													grupo: groups[0].cn 
												}
											}
										});
									}
								});	
							}
						}
					});	*/
	
				//console.log(groups);	

				var first_perfil = groups[0].cn;

				req.session.user = {

					token: hash,
					name: userbase,
					profile: first_perfil

				};
				//console.log(req.session.user);

				res.status(200).send(req.session.user);
			}

		});
	});
		//Validacion Local
     		} else {
	 
		data.collection('users').find({name: req.body.username}).toArray(function(err, result){
			//console.log(result);
			if(result[0] === undefined) {
				res.status(501).send({ 
						err: 404, 
						descripcion: "Usuario inexistente en DB"
					});
					return;
				}

			result.forEach(function(currentValue) {
				if(currentValue.password !== req.body.password) {
					res.status(401).send({ 
							err: 401, 
							descripcion: "Contraseña incorrecta"
						});
						return;
					}
						
				req.session.user = {
					token: hash,
					 name: currentValue.name,
				  profile: currentValue.profiles
				};

				res.status(200).send(req.session.user);
				});
			});
   	}
});

module.exports = router;
