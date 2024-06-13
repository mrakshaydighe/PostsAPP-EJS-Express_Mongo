const mongoose = require("mongoose");
const MongoURI = `mongodb://127.0.0.1:27017/DataAssociation`

const Connect = ()=>{
    try{
        mongoose.connect(MongoURI)
        console.log(`Connected To Database`)
    }catch(err){
        console.log(err)
    }
}

module.exports = Connect;