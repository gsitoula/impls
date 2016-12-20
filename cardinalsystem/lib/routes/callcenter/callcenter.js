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

var urlConnect = config.dbHost+"/"+config.db;

var mongoConnection;
MongoClient.connect(urlConnect, function(err, db) {
	if (err) { 
		throw err;
	}
	mongoConnection = db;
});

router.get('/getContactsByCampana', function(req, res, next) {
	
	mongoConnection.collection(req.query.collection)
	.find()
	.toArray((err, result) => {
		if(err) return err;
		console.log(result[0]);
		res.status(200).send(result[0]);
	})
});

router.get('/getContactsById', (req, res, next) => {
	
	var model_data = req.query;
	
	if(model_data.id) 
		{
			console.log(typeof model_data.id);
			
			var objID= new ObjectID(req.query.id);

      		mongoConnection.collection(req.query.collection)
      		.find({ AVAILABLE: true,
      			_id: { 
      			  $gt: objID
      			}
      		}).toArray((err, result) => {
        		if(err) {
            		res.status(501).send(err);
            		return;
        		} else {
          			  if(result.length != 0) 
          			{
	          			console.log(result[0]);
	          			  var my_model = result[0];

	          			  function lockContact(collection, model) {
	    				    return new Promise((resolve, reject) => {
	  	   					  mongoConnection.collection(collection)
	  	    				    .update({
	  	    				      _id: model._id
	  	    					}, {
	  	    					  $set: {
	  	    	  				    AVAILABLE: false
	  	    					  }
	  	    					}, (err, result) => {
	  	    					  if(err) {
	  	    					    reject(err);
	  	    					  }
	  	    					  resolve({update_lock: result.result, model: my_model});
	  	    					})
	  						});
	  					}

	  					lockContact(model_data.collection, my_model)
	  					.then(
	  						(result) => {
	  							console.log(result.result);
	  							res.status(200).send(result.model);
	  					})
          			} 
          			  else 
          			{
          				res.status(404).send({ code: 404, descripcion: "no hay registros disponibles"});	
          			}
         		}
    		});
		} 
		  else 
		{
			var objFind={
				AVAILABLE: true
			};
			mongoConnection.collection(req.query.collection)
	      		.find(objFind).toArray((err, result) => {
	        		if(err) {
	            		res.status(501).send(err);
	            		return;
	        		} else {
	          			console.log(result[0]);
	          			//res.status(200).send(result[0]);
	          			var my_model = result[0];

	          			  function lockContact(collection, model) {
	    				    return new Promise((resolve, reject) => {
	  	   					  mongoConnection.collection(collection)
	  	    				    .update({
	  	    				      _id: model._id
	  	    					}, {
	  	    					  $set: {
	  	    	  				    AVAILABLE: false
	  	    					  }
	  	    					}, (err, result) => {
	  	    					  if(err) {
	  	    					    reject(err);
	  	    					  }
	  	    					  resolve({update_lock: result.result, model: my_model});
	  	    					})
	  						});
	  					}

	  					lockContact(model_data.collection, my_model)
	  					.then(
	  						(result) => {
	  							console.log(result.model);
	  							res.status(200).send(result.model);
	  					})    
	         		}
	    		});	
		}
});



router.post('/changeContactState', function(req, res, next) {
	var model_obj = req.body;
	console.log(model_obj);
	
	function changeContactState(model) {
  	  return new Promise((resolve, reject) => {
  	  	mongoConnection.collection(model.collection)
  	  	  .update({
		    _id: new ObjectID(model_obj.contacto_id)
			  }, {
			    $set: {
				  ESTADO: model_obj.new_state,
				  MOTIVO: model_obj.motivo,
				  AVAILABLE: true
				}
			}, (err, myResult) => {
				if(err){
				    reject(err);
				    return;
				} else {
				    resolve(myResult.result);
				}
			})
  	  	})
  	}
  	
  	changeContactState(model_obj)
  	  .then(
  	  	(result) => {
  	  		res.status(200).send(result);
  	  	})  
  	  
});

router.get('/getContact', (req, res, next) => {
	
	var model = req.query;

	console.log(model);

	function queryContacts(model) {
		return new Promise((resolve, reject) => {
		  mongoConnection.collection(model.collection)
	  	    .find({ estado: Number(model.state), campana: model.campana })
	          .toArray((err, result) => {
	    	    if(err) {
	    	      console.log(err);
	    		  return;
	    	    } else {
	    	      console.log(result);
	    	  			
	    	        if(result.length == 0) 
	    	      { 
	    	      	resolve({ code: 404, descripcion: "no hay registros disponibles"});
	    	      } 
	    	        else 
	    	      {
		    	    var obj_contact = result[0];
		    	       
		    	  	mongoConnection.collection(model.collection)
		    		  .update({
		    	  	  	_id: result[0]._id
		    	  	  }, {
		    		  	$set: {
		    	  	      estado: -1
		    	  	  	}
		    	  	  }, (err, result) => {
		    	  	  	   resolve({
		    	  	  	     contacto: obj_contact,
		    	  	  	  	 change_available: result.result
		    	  	  	   })
		    	  	     })
	    	      }	
	    	    }
	          });
		});
	}

	queryContacts(model).then(
		(result) => {
			res.status(200).send(result);
		})
});

module.exports = router;
