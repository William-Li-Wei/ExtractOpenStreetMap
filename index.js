const _ = require('lodash');
const fs = require('fs');

const SOURCE_FILE = 'germany_streets.txt';
const RESULT_FILE = 'streetName.json';

const MAX_ENTITY_NUMBER = 30000;






function readXmlFile(fileName, callback) {
  // fs.readFile(fileName, 'utf8', function(err, data) {
  //   console.log(data);
  //   console.log(typeof data);
  // });

  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(fileName)
  });

  lineReader.on('line', function (line) {
    console.log('Line from file:', line);
  });

}

function writeEntityJsonToFile(fileName, entityJson) {
  fs.writeFile(fileName, JSON.stringify(entityJson), 'utf8', function() {
    console.log('=== Done !!!');
  });
}

function getStreetNameOfWay(way) {
  const wayTags = _.get(way, 'tag');
  const nameTags = _.filter(wayTags, function(tag) {
    return _.get(tag, '$.k') === 'name';
  });
  const nameTag = nameTags[0];

  return _.get(nameTag, '$.v');
}

function createEntityJson(streetNames) {


  _.forEach(streetNames, function(name) {
    entity.entries.push({
      "value": name,
      "synonyms": [
        name
      ]
    });
  });

  return entity;
}

function extractStreets() {
  const sourceFile = __dirname + '/' + SOURCE_FILE;
  const resultFile = __dirname + '/' + RESULT_FILE;

  var entityJson = {
    "id": "",
    "name": "",
    "isOverridable": true,
    "entries": [],
    "isEnum": false,
    "automatedExpansion": false
  };

  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(sourceFile)
  });

  var count = 0;

  lineReader
    .on('line', function (streetName) {
      entityJson.entries.push({
        "value": streetName,
        "synonyms": [
          streetName
        ]
      });
      count ++;
      if(count % MAX_ENTITY_NUMBER == 0 ) {
        const index = Math.ceil(count / MAX_ENTITY_NUMBER);
        const resultFile = __dirname + '/streetName' + index + '.json';
        if(index < 10) {
          entityJson.id = '6be62823-c143-4aae-b015-26958d88a5' + '0' + index;
        } else {
          entityJson.id = '6be62823-c143-4aae-b015-26958d88a5' + index;
        }
        entityJson.name = 'testStreetName' + index;
        writeEntityJsonToFile(resultFile, entityJson);
        console.log('============ batch ' + index + ' done =============');
        entityJson.entries = [];
      }
      console.log(count + ' line added: ' + streetName);
    })
    .on('close', function () {
      const index = Math.ceil(count / MAX_ENTITY_NUMBER);
      const resultFile = __dirname + '/streetName' + index + '.json';
      if(index < 10) {
        entityJson.id = '6be62823-c143-4aae-b015-26958d88a5' + '0' + index;
      } else {
        entityJson.id = '6be62823-c143-4aae-b015-26958d88a5' + index;
      }
      entityJson.name = 'testStreetName' + index;
      writeEntityJsonToFile(resultFile, entityJson);
      console.log('============ batch ' + index + ' done =============');
    });



  // console.log('>>> 1. Reading source file ' + sourceFile + ' ...');
  // readXmlFile(sourceFile, function(result) {
    // console.log('>>> 2. Extracting streets ...');
    // const streetTags = _.get(result, 'osm.tag');
    // const streetNames = _.map(streetTags, function(tag) {
    //   return _.get(tag, '$.v');
    // });
    //
    // // console.log(ways.length);
    // // const streetNames = _.map(ways, function(way) {
    // //   return getStreetNameOfWay(way);
    // // });
    // console.log('>>> 3. Generate entity out of streets ...');
    // const entityJson = createEntityJson(streetNames);
    //
    // console.log('>>> 4. Export the entity to JSON file ' + resultFile + ' ...');
    // writeEntityJsonToFile(resultFile, entityJson);
  // })
}

extractStreets();