//.csv to MongoDB

//import Model
const Score = require('../db/models/Score');

const mongoose = require('mongoose');

require('dotenv').config()
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

const script = async () => {
    await dbConnect()

    await normalizeData()
}

const normalizeData = async () => {
    Score.updateMany(
        {}, // Filtro vacío para actualizar todos los documentos
        [
            {
                $set: {
                    evaluacion_normalizada: {
                        $switch: {
                            branches: [
                                { case: { $lte: ["$evaluacion", 12.5] }, then: 1 },
                                { case: { $lte: ["$evaluacion", 37.5] }, then: 2 },
                                { case: { $lte: ["$evaluacion", 62.5] }, then: 3 },
                                { case: { $lte: ["$evaluacion", 87.5] }, then: 4 }
                            ],
                            default: 5
                        }
                    }
                }
            }
        ]
    )
    .then(result => {
        console.log('Documentos actualizados exitosamente:', result)
    })
    .catch(error => {
        console.error('Error al actualizar documentos:', error);
    });
}

script()










