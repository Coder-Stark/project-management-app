import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        trim: true
    },
    email: {
        type: String,
        required: true,
        unqiue: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    }
}, {timestamps: true});

//how user sees json (_id -> id (for frontend))
userSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
