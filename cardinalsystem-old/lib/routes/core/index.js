'use strict';
var config = require('config');
var router = require('express').Router();

router.get("/getPricing", function(req, res){
console.log("paso por core");
    
    /*Parametros
    first: Valor Primer periodo
    period: Cantidad de meses del contrato
    range: rango de escalonamiento
    percent: porcentaje de aumento
    */
    var monthValue = Number(req.query.first);
    var period = Number(req.query.period);
    var range = Number(req.query.range);
    var percent = Number(req.query.percent);

    var contMonth=0;
    var monthChange=range;

    var aResult=[];
    
    for(var i=1;i <= period; i++)
    {
      aResult.push({mes:i,monto:monthValue.toFixed(2)});
      if(i==monthChange)
      {
          console.log("mes: "+monthChange);
          monthValue*=(1+percent/100);
          monthChange+=Number(range);
          console.log("Nuevo mes: "+monthChange);
      }
    }

    res.status(200).send(aResult);
});

module.exports = router;