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

var mongoConnection;
MongoClient.connect(urlConnect, function(err, db) {
	if (err) { 
		throw err;
	}
	mongoConnection = db;
});

let file_first_name = "last-import.csv"

	// Storage option can be changed - check Multer docs 
	var storage = multer.diskStorage({
		destination: function(req, file, cb) {
			//console.log(file);
        	var path = './uploads' // Make sure this path exists 
        	cb(null, path)
        }, 	
        filename: function (req, file, cb) {

  			/**
  			 **	You can change the file name here where *<FileName>* is.
  			 ** Use file.originalname to put the same name
  			 ** of the file you are uploading 
  			 **/ 

  			 cb(null, /*<FileName>*/ file_first_name );
  			}
  		})
	var upload = multer({
		storage: storage
	}).single('file');


	router.post('/uploadFile', function(req, res ,next) {
		upload(req, res, function(err) {
			if (err){
				res.status(501).send(err);
				return err;	
			} else {
				//console.log(req.body);
					
				function puts(error, stdout, stderr) { 
					console.log(stderr);
					console.log(stdout); 
				};
				exec("mv -v uploads/" + file_first_name + " " + "uploads/" + req.body.campana_id , puts);
				
				mongoConnection.collection('tabla_importacion')
				.save({
					cliente: req.body.cliente_id, 
					campana: req.body.campana_id, 
					archivo: req.body.campana_id
				}, (err, result) => {
					if(err) return err;
					console.log("registro guardado en tabla_importacion");
				});
				res.status(200).send("Archivo subido con exito");
			}
		});
	});

	router.get('/headValidation', (req, res, next) => {
		//console.log(req.query.file);
		mongoConnection.collection('esquemas_campanas')
		.find({CAMPANA: req.query.file})
		.toArray((err, result) => {
					if(err) return err; //Object.values() 
					//console.log(result[0]);
					var my_data_schema = result[0].file_header;
					//console.log(my_data_schema);
					function puts(error, stdout, stderr) { 
						//console.log(stderr);
						//console.log(stdout);
						var arr_file_head = [];
						var file_head = stdout.split(',');
						//console.log(file_head);
						file_head.forEach((currVal) => {
							//console.log(currVal);
							arr_file_head.push(currVal);
						})
						
						var file_head_depurado = file_head[file_head.length-1].slice(0, file_head[file_head.length-1].lastIndexOf('\n\r'))
							//file_head = file_head[file_head.length-1].slice(0, file_head[file_head.length-1].lastIndexOf('\n\r'));
						arr_file_head.pop();
						arr_file_head.push(file_head_depurado);
						//console.log(arr_file_head);
						
						function validateHead (arr_schema, arr_file) {

							return new Promise((resolve, reject) => {
								var truty_array = []; 
								if(arr_schema.length != arr_file.length) {
									reject({desc: "Las cabeceras son diferentes"});
								} else {
									for(var i=0;i<arr_schema.length;i++) {
										var obj = {
											arr_schema: arr_schema[i],
											arr_file: arr_file[i]
										};
										if(obj.arr_schema === obj.arr_file) {
											truty_array.push(true);
										} else {
											truty_array.push(false);
										}
									}
								}	

								truty_array.forEach((isTrue) => {
									if(isTrue !== true) {
										reject({desc: "las cabeceras no son iguales"});
									}
								});
									resolve({desc: "las cabeceras son iguales"})
							});
						};

						validateHead(my_data_schema, arr_file_head)
						.then((result) => {
							console.log(result);
							res.status(200).send(result);
						})
						.catch((err) => {
							console.log(err);
							res.status(501).send(err);
						})

					};
					exec("head -n 1 uploads/" + req.query.file, puts);
					//res.status(200).send(result[0].esquema_de_datos);
				});
	});

	var hello  = require('./hello.js');

	router.get('/readFile', function(req, res , next) {

		//console.log(req.query.file);
		var instream = fs.createReadStream("uploads/" + req.query.file);
		var outstream = new stream;
		var rl = readline.createInterface(instream, outstream);
		let arr_model = [];
		let split_it;

		rl.on('line', function(line) {
			split_it = line.split('\n');
			split_it = split_it[0].split(',');
			arr_model.push(split_it);
			//console.log(arr_model);
		});

		function getSchema (q) {
			var arr = [];
			return new Promise((resolve, reject) => {
				mongoConnection.collection('esquemas_campanas')
				.find({CAMPANA: req.query.file})
				.toArray((err, result) => {
					//console.log(Object.keys(result[0].esquema_de_datos));
					//resolve();
					var object = Object.keys(result[0].esquema_de_datos);
					
					arr_model.forEach((currVal, index) => {
						if(index != 0) {
							//console.log(object);
							var obj = currVal.reduce((o, v, i) => {
								o[result[0].esquema_de_datos[i]] = v;
									//console.log(o);
									return o;
								}, {});
							//console.log(obj);
							arr.push(obj);
							//console.log(arr);
							resolve(arr);
						}
					})
				});
			});
		}

		rl.on('close', function() {
			var my_schema;
			
			getSchema({})
			.then((schema)=>{
					//console.log(schema);
					my_schema = schema;

					var objRecord = {
						"campana": req.query.file,
						"contactos": schema
					};
					//console.log(schema);
					console.log(objRecord);

					mongoConnection.collection('test_contacts').drop();

					schema.forEach((currRecord) => {
						

						currRecord.ESTADO = 0;
						currRecord.CAMPANA = req.query.file;							

						console.log(currRecord);

						mongoConnection.collection('test_contacts')
						.save(currRecord, (err, result) => {
							if(err){
								throw err; 
								return;
							} else {
									console.log(result);
									//res.status(200).send(result);
								}
							});
					});
				})
			.then(() => {
				res.status(200).send("lala");
			})	 
		});
	}); 


	module.exports = router;