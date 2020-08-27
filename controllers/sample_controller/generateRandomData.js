var express = require('express')
var router = express.Router()
fs = require('fs');

var sampleData = require('../../models/sample_model/generateRandomData')

router.post('/', function(req,res) {
  //Capturing API start time
  var start_time = new Date();
  var body = req.body;
  const contentType = req.headers['content-type'];

  if(!/^application\/json/.test(contentType)){
    var err = new Error('Invalid content-type.\n' +
    `Expected application/json but received ${contentType}`);
  }else{
    sampleData.sample(body,function(responseFromCallbackFn) {
      
      res.send(responseFromCallbackFn)
    });
  }
  if(err){
    res.send({"error":{"message":err.message}})
  }
})


//Get all records
router.get('/getAllRecords', function(req,res) {
  var params = req.params;
  sampleData.getAllRecords(params,function(responseFromCallbackFn) {
    res.send(responseFromCallbackFn)
  });
})

module.exports = router
