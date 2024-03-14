//.csv to MongoDB

//import Model
const Evaluation = require('../db/models/Evaluation');
const Score = require('../db/models/Score');
const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const procesadas = {}

require('dotenv').config()

const headers = ['id1', 'id2', 'oracion', 'id3', 'id4', 'palabraCompleja','id5']


const dataParaGuardar = []

const MONGODB_URI = process.env.MONGODB_URI; // Your MongoDB connection string

const opts = {
    bufferCommands: false,
  };

  let cached = global.mongoose;

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }
  
  async function dbConnect() {
    if (cached.conn) {
      return cached.conn;
    }
  
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };
  
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  }

const createReadStream = async () => {
    await dbConnect()

    fs.createReadStream('src/app/scripts/CWI.csv')
    .pipe(csv({ separator: ';', headers: headers }))
    .on('data', (data) => {
        
        const oracion = data['oracion']
        if (!procesadas[oracion]) {
            dataParaGuardar.push({
                oracion: data['oracion'],
                palabraCompleja: data['palabraCompleja'],
                evaluacion: 0
            })

            procesadas[oracion] = true
        }
    })
    .on('end', () => {
        // Evaluation.insertMany(dataParaGuardar)
        //     .then(() => {
        //         console.log('Data saved')
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
    });
}

createReadStream()









