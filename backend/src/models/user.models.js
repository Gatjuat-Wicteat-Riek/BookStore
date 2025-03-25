import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    profileImage:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User