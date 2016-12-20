var MongoClient = require('mongodb').MongoClient;
var config = require('config');  

var urlConnect = config.dbHost+"/"+config.db;

var mongoConnection;
MongoClient.connect(urlConnect, function(err, db) {
	if (err) { 
		throw err;
	}
	mongoConnection = db;
});

let sayHello = function(obj) {

  mongoConnection.collection('esquemas_campanas').find({name: 'test_campana'}).toArray(function(err, result) {
		if(err) return err;
			result[0].datos_mapeados.forEach(value => {
				obj[value] = null;
				//console.log(obj);
				return obj;
			});
	});
};

module.exports = sayHello; 
