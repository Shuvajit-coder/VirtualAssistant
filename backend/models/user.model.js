import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
    },
    password:{
        type:String,
        required:true
    },
    assistantName:{
        type:String
    },
    assistantImage:{
        type:String
    },
    history:[
        {type:String}
    ]

},{timestamps: true})


const User = mongoose.model("User",userSchema)
export default User;