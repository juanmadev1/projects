import Task from "../models/task.model.js";
import cloudinary from "../utils/cloudinary.js"; // Asegúrate de importar la configuración de Cloudinary


export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate("user");
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, date, image, latitude, longitude } = req.body;

    const newTask = new Task({
      title,
      description,
      date,
      image,  // Asegúrate de que este campo se llame 'image'
      user: req.user.id,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, date, image, latitude, longitude } = req.body;
    const taskUpdated = await Task.findOneAndUpdate(
      { _id: req.params.id },
      {
        title,
        description,
        date,
        image,
        location: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        }
      },
      { new: true }
    );
    return res.json(taskUpdated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('user', 'username');
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    task.comments.push({ user: userId, content, rating });
    task.updateAverageRating();
    await task.save();

    const populatedTask = await Task.findById(taskId).populate('comments.user', 'username');
    res.json(populatedTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId).populate('comments.user', 'username');
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.json(task.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { taskId, commentId } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const comment = task.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    // Verifica si el usuario es el autor del comentario o el autor de la tarea
    if (comment.user.toString() !== userId && task.user.toString() !== userId) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este comentario" });
    }

    task.comments.pull({ _id: commentId });
    await task.save();

    res.json({ message: "Comentario eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    return res.status(500).json({ message: error.message });
  }
};
