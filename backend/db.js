const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/iNotebook?directConnection=true"

const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(mongoURI) 
        console.log('Connected to Mongo Sucessfully')
    }
    catch(error) {
        console.log(error)
        process.exit()
    }
}
module.exports = connectToMongo