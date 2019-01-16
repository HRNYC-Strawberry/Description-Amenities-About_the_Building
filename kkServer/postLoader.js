let pool = require('./postgresdb.js')
let { generator } = require('./dataGenerator')
let converter = require('json-2-csv');
// let createCsvWriter = require('csv-writer').createArrayCsvWriter;




// use the data generation script to create one batch of data
// maybe I could create 10M records at once?
// write each batch to a csv and load it into postgres
// on each successful query, run the loading func again

// let csvWriter = createCsvWriter({
    // header: ['id', 'description', 'highlightAmens', 'buildingAmens', 'listingAmens', 'outdoorAmens'],
    // path: './batch.csv'
// });


let currentTotal = 0;
let dataTotal = 500000;
let batchNumber = 0;

let postLoader = () => {
  let data = generator(500000, currentTotal)
  converter.json2csvAsync(data)
    .then(() => {
      console.log('created a CSV!');
      pool.query(`COPY descriptions.descriptions FROM '${__dirname}\\batch.csv' DELIMITER ',' CSV HEADER`)
        .then(() => {
          console.log('DONEZO');
        })
        .catch((err) => {
          console.log(err);
        })
    })
    .catch((err) => {
      console.log(err);
    })
  
  // csvWriter.writeRecords(data)
  //   .then(() => {
  //     console.log('created a CSV!');
  //     pool.query(`COPY descriptions.descriptions FROM '${__dirname}\\batch.csv' DELIMITER ',' CSV HEADER`)
  //       .then(() => {
  //         console.log('DONEZO');
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   })

  // DescriptionBox.collection.insertMany(data, (err, doc) => {
  //   if (err) console.log(err);
  //   else if (currentTotal < dataTotal) {
  //     if (!(currentTotal % 1000000)){
  //       batchNumber++;
  //       console.log(`Loading batch #${batchNumber}/10`);
  //     } 
  //     currentTotal += 100000
  //     loader();
  //   } else {
  //     if (currentTotal >= dataTotal) console.timeEnd('loadTime')
  //   }
  // })
}

postLoader();