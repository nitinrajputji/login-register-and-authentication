const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/registration",{
     useNewUrlParser:true, 
     useUnifiedTopology:true,
     useCreateIndex:true,
     useFindAndModify:false
    }).then(()=>{
         console.log("connection sucessful..");
    })
    .catch((err)=>{
         console.log("no  connection ")});