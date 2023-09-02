import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    userName:{
        type:String,
        required:[true , 'username is required'],
        min:[3,'minimum lenght is 3 char'],
        max:[15,'maximum lenght is 10 char'],
    },
    email:{
        type:String,
        required:[true , 'email is required'],
        unique:[true , 'email must be unique'],
        lowercase:true,
    },
    confirmemail:{
        type:Boolean,
        default:false,
    },
    password:{
        type:String,
        required:[true , 'password is required']
    },
    cpassword:{
        type:String,
    },
    phone:{
        type:String,
        required:[true , 'phone is required']
    },
    role:{
        type:String,
        default:'User',
        enum: ["User", "Admin"],
    },
    status:{
        type:String,
        default:'offline',
        enum: ["offline", "online" ,"blocked"],
    },
    gender:{
        type:String,
        default: "male",
        enum: ["male", "female"],
    },
    age: {
        type: Number,
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    image:{
        url:{
            type:String,
            default: "https://res.cloudinary.com/dvpxyuuhm/image/upload/v1693316729/defaultPic/OIP_n0xp0v.jpg",
        },
        public_id:{
            type:String,
            default: "defaultPic/OIP_n0xp0v",
        }
    },
    DOB:{
        type:Date
    },
    code:{
        type:String,
        min:[6,'code lenght must be 6 char'],
        max:[6,'code lenght must be 6 char'],
    }
}, 
{
    timestamps:true
}
)

const userModel =mongoose.models.User|| model("User",userSchema)


export default userModel