import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        trim: true, 
        default: "" 
    },
},{ timestamps: true });

projectSchema.index({ owner: 1, createdAt: -1 });

projectSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Project = mongoose.model("Project", projectSchema);