import mongoose from "mongoose";
import { DEFAULT_TASK_STATUS, TASK_STATUSES } from "./tasks.config.js";

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
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
    status: { 
        type: String, 
        enum: TASK_STATUSES, 
        default: DEFAULT_TASK_STATUS 
    },
    dueDate: { 
        type: Date, 
        default: null 
    },
  },
  { timestamps: true }
);

taskSchema.index({ project: 1, createdAt: -1 });

taskSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Task = mongoose.model("Task", taskSchema);