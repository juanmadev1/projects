import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
}, { timestamps: true });

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    comments: [commentSchema],
    averageRating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ location: '2dsphere' });

// Método para calcular y actualizar la puntuación promedio
taskSchema.methods.updateAverageRating = function() {
  const comments = this.comments;
  if (comments.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
    this.averageRating = sum / comments.length;
  }
};

export default mongoose.model("Task", taskSchema);
