
'use strict';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var config = require('config');
var router = require('express').Router();
var urlConnect = config.dbHost+"/"+config.db;

var data;
MongoClient.connect(urlConnect, function(err, db) {
  if (err) { 
    throw err;
  }
  data = db;
});


router.get("/getData", function(req, res){
    /* Parametros collection */
    console.log(req.query.collection);
    console.log(req.query.id);
    
    if(req.query.id)
    {
      var objID= new ObjectID(req.query.id);
      var objFind={_id:objID};
    }
    else
      var objFind={};

      if(req.query.order)
        objOrder={"req.query.order":1};
      console.dir(objFind);
    data.collection(req.query.collection).find(objFind).toArray(function(err, result){
        
        if(err)
        {
            res.status(501).send(err);
            return;
        }
        
        /*
        result.forEach(function(row){
          
          if(row.TIPO==1)
            row.DESCTIPO="PROPIETARIO";
          else
            row.DESCTIPO="GARANTE";  
        });
        */
      //var objResult={total:result.length, body:result};
      res.status(200).send(result);    

    })
});


router.post("/setData",function(req, res){
  
  console.dir(req.body);
  
  var collection=req.body.collection;

 req.body.registro._id=new ObjectID(req.body.registro._id);


  data.collection(collection).save(req.body.registro, {w:1}, function(err, result){
    if(err){
      res.status(501).send(err);
      return;
    }
    
    console.log({ linea: 75, resultado: result.nUpserted });

    res.status(200).send(result);
  });

});

router.get("/getContrato", function(req, res){
    
    console.log(req.query.collection);
    console.log(req.query.cliente_id);
    
    data.collection(req.query.collection)
      .find({"cliente.idDb": req.query.cliente_id})
        .toArray(function(err, result){
            //console.log(result);
            res.status(200).send(result);
    });
});

module.exports = router;
