  var config = require('config');
  var MongoClient = require('mongodb').MongoClient;
  var ObjectID = require('mongodb').ObjectID;

  var urlConnect = config.dbHost+"/"+config.db;

  var mongoConnection;
		MongoClient.connect(urlConnect, function(err, db) {
			if (err) { 
				throw err;
			}
			mongoConnection = db;
	});

  let data_processor = (model) => {
	  var obj_asignacion = {};
	  return new Promise((resolve, reject) => {
		  //console.log(model);
		
		  obj_asignacion.CLIENTE = model.campana_asignada.CLIENTE;
		  obj_asignacion.CAMPANA = model.campana_asignada.CAMPANA;
		  obj_asignacion.CLIENTE_ID = model.campana_asignada.CLIENTE_ID;
		  obj_asignacion.CAMPANA_ID = model.campana_asignada.CAMPANA_ID;
		  obj_asignacion.ESTADOS = {};
		
		  model.campana_asignada.ESTADOS_ASIGNADOS.forEach(
			  (currState) => {
				  //console.log(currState.columns[0]);
				  
				  var ops_array = [];
				  var ops_obj = {};

				  currState.columns[0].forEach((currOps) => {
							ops_obj.NOMBRE = currOps.id;
							ops_obj.ID = currOps._id;
							console.log(currOps._id);

							mongoConnection.collection('tabla_operadores')
	  	    		  .update({
	  	    		    _id: ObjectID(currOps._id)
	  	    		      },{
	  	    		        $set: {
	  	    	            DISPONIBLE: false
	  	    		        }
	  	    		    }, (err, result) => {
	  	    		      if(err) {
	  	    		        console.log(err);
	  	    		      }
	  	    		      console.log(result.result);
	  	    		  });

							ops_array.push(ops_obj);
							ops_obj = {};	
						  obj_asignacion.ESTADOS[currState.id] = ops_array;
						  resolve(obj_asignacion);
				  });
			  });
	  });
  };

  module.exports = data_processor;