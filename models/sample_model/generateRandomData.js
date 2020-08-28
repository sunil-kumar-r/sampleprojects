var db = require('../../db');
//using faker to generate random data
const faker = require('faker');
// require csv-writer module
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

exports.sample = function (body,cb) {
//function to split entered number as parts
  var splitInteger = function(num, parts) {  
    var val;
    var mod = num % parts;
    if(mod == 0){
      val = num/parts;
      retData = Array(parts).fill(val);
    } else {
      val = (num-mod)/parts;
      retData = Array(parts).fill(val);
      for(i=0;i<mod;i++){
        retData[i] = retData[i] + 1;
      }
      retData.reverse()
    }
    return retData;
  }

  //splitting entered number to 10 parts - can even take this as input from user
  var splitArray = splitInteger(body.number, 10)
  
  //specifying collection name to be inserted
  var collectionSampleData = db.get().collection('sampleData');
  splitArray.map(d =>
    {
      inserData(d);
    })

  cb({"msg":"inserted successfully"});

  //function to insert specific parts of data
  function inserData(val){
    var data = [];
    //loop to create required number of objects
    for(var i=1; i<=val; i++)
    {
        //create object with random data
        var obj = {};
        //using faker to generate random number,word and description
        obj.uid = faker.random.number();
        obj.name = faker.random.word();
        obj.desc = faker.random.words(8);
        //insert generated object to array
        //data = [...data,obj];
        data.push(obj);
    }
    //using insertMany since we have to insert array of data
    collectionSampleData.insertMany(data , function(err,res) {
      if(res){
        //cb(res);
        console.log("Inserted");
      }else{
        //if error in inserting then display error msg
        var sendData = {};
        sendData.status = "error_during_insertion";
        cb(sendData);
      }
    })
  }
}


//Get all records
exports.getAllRecords = function (params,cb) {
  var collectionSampleData = db.get().collection('sampleData');
  //{"approved":1}
  collectionSampleData.find().toArray(function(err,docs){
    //check if collection has values
    if(docs.length > 0){
      //configure csvWriter with output file name and headers
      const csvWriter = createCsvWriter({
        path: 'sampleData.csv',
        header: [
          {id: '_id', title: 'id'},
          {id: 'uid', title: 'uid'},
          {id: 'name', title: 'name'},
          {id: 'desc', title: 'desc'},
        ]
      });
      //Write to csv file
      csvWriter
      .writeRecords(docs)
      .then(()=> console.log('The CSV file was written successfully'));

      cb({"message":"Records Found","data":docs,"status":200})
    }else{
      cb({"message":"No Records Found","status":204})
    }
  })
}
