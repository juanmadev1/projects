import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, Card, Input, Label } from "../components/ui";
import { useTasks } from "../context/tasksContext";
import { Textarea } from "../components/ui/Textarea";
import { useForm } from "react-hook-form";
import axios from "axios"; // Asegúrate de instalar axios

dayjs.extend(utc);

export function TaskFormPage() {
  const { createTask, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let imageUrl = null;

      // Si hay una imagen seleccionada, sube la imagen a Cloudinary
      if (data.image && data.image.length > 0) {
        const formData = new FormData();
        formData.append("file", data.image[0]);
        formData.append("upload_preset", "ml_default"); // Cambia esto por tu upload preset de Cloudinary

        const response = await axios.post("https://api.cloudinary.com/v1_1/dswkqhynv/image/upload", formData);
        imageUrl = response.data.secure_url; // Guarda la URL de la imagen
      }

      // Prepara los datos de la tarea para enviar al backend
      const taskData = {
        ...data,
        date: dayjs.utc(data.date).format(), // Asegúrate de que la fecha esté en el formato correcto
        imageUrl: imageUrl, // Incluye la URL de la imagen si se subió
      };

      // Llama a createTask o updateTask según si hay un ID de tarea
      if (params.id) {
        await updateTask(params.id, taskData); // Espera a que se complete la actualización
      } else {
        await createTask(taskData); // Espera a que se complete la creación
      }

      navigate("/tasks"); // Navega a la lista de tareas después de guardar
    } catch (error) {
      console.error('Error al crear o actualizar la tarea:', error);
      // Aquí puedes mostrar un mensaje de error al usuario
    }
  };

  useEffect(() => {
    const loadTask = async () => {
      if (params.id) {
        const task = await getTask(params.id);
        setValue("title", task.title);
        setValue("description", task.description);
        setValue("date", task.date ? dayjs(task.date).utc().format("YYYY-MM-DD") : "");
        setValue("completed", task.completed);
      }
    };
    loadTask();
  }, [params.id, getTask, setValue]);

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          name="title"
          placeholder="Title"
          {...register("title")}
          autoFocus
        />
        {errors.title && (
          <p className="text-red-500 text-xs italic">Please enter a title.</p>
        )}

        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          id="description"
          rows="3"
          placeholder="Description"
          {...register("description")}
        ></Textarea>

        <Label htmlFor="date">Date</Label>
        <Input type="date" name="date" {...register("date")} />

        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          name="image"
          accept="image/*"
          {...register("image")}
        />
        {errors.image && (
          <p className="text-red-500 text-xs italic">Please upload an image.</p>
        )}

        <Button>Save</Button>
      </form>
    </Card>
  );
}
