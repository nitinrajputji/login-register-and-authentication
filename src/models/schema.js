const mongoose=require('mongoose');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');

const userRegiter=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        requried:true,
    },
    passward:{
        type:String,
        require:true
    },
    cpassward:{
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
})
// genreating token
userRegiter.methods.genreatetoken=async function(){
    try {
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
        
    } catch (error) {
        res.send("the error part  "+ error);
        
    }
}


// converting into hash
userRegiter.pre("save",async function(next){
    if(this.isModified("passward") ){
        console.log(`the current passward is ${this.passward}`);
        this.passward= await bcrypt.hash(this.passward,10);
        console.log(`the current passward is ${this.passward}`)
         this.cpassward=undefined;
    }
   
    next();

})

const Register=new mongoose.model("Register",userRegiter);
module.exports = Register;