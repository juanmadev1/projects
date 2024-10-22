import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
  getAllTasks,
  addComment,
  getComments,
} from "../controllers/tasks.controllers.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import multer from "multer"; // Asegúrate de importar multer

const router = Router();
const upload = multer({ dest: 'uploads/' }); // Configura multer aquí

// Rutas para obtener tareas
router.get("/tasks", getAllTasks);
router.get("/tasks/user", auth, getTasks);

// Ruta para crear una nueva tarea
router.post("/tasks", auth, upload.single('image'), validateSchema(createTaskSchema), createTask);

// Rutas para obtener, actualizar y eliminar una tarea específica
router.get("/tasks/:id", auth, getTask);
router.put("/tasks/:id", auth, updateTask);
router.delete("/tasks/:id", auth, deleteTask);

router.post("/tasks/:taskId/comments", auth, addComment);
router.get("/tasks/:taskId/comments", getComments);

export default router;
