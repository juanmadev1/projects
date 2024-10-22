import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, Card, Input, Label } from "../components/ui";
import { useTasks } from "../context/tasksContext";
import { Textarea } from "../components/ui/Textarea";
import { useForm } from "react-hook-form";
import axios from "axios"; // Asegúrate de instalar axios
import { AutocompleteInput } from "../components/utils";
import { MapComponent } from "../components/MapComponent";

dayjs.extend(utc);

export function TaskFormPage() {
  const { createTask, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [location, setLocation] = useState({ lat: 40.416775, lng: -3.703790 });
  const [imagePreview, setImagePreview] = useState(null);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let imageUrl = data.image;

      if (data.image instanceof FileList && data.image.length > 0) {
        const formData = new FormData();
        formData.append("file", data.image[0]);
        formData.append("upload_preset", "ml_default");

        const response = await axios.post("https://api.cloudinary.com/v1_1/dswkqhynv/image/upload", formData);
        imageUrl = response.data.secure_url;
      }

      const taskData = {
        ...data,
        date: data.date ? dayjs.utc(data.date).format() : null,
        image: imageUrl,  // Cambiado de 'imageUrl' a 'image' para coincidir con el modelo
        latitude: location.lat,
        longitude: location.lng,
      };

      if (params.id) {
        await updateTask(params.id, taskData);
      } else {
        await createTask(taskData);
      }

      navigate("/tasks");
    } catch (error) {
      console.error('Error al crear o actualizar la tarea:', error);
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
        setValue("image", task.image);
        setImagePreview(task.image);
        if (task.location && task.location.coordinates) {
          setLocation({
            lng: task.location.coordinates[0],
            lat: task.location.coordinates[1]
          });
        }
      }
    };
    loadTask();
  }, [params.id, getTask, setValue]);

  const handleLocationSelect = (lat, lng) => {
    setLocation({ lat, lng });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="title">Título</Label>
        <Input
          type="text"
          name="title"
          placeholder="Título"
          {...register("title", { required: true })}
          autoFocus
        />
        {errors.title && (
          <p className="text-red-500 text-xs italic">Por favor, ingrese un título.</p>
        )}

        <Label htmlFor="description">Descripción</Label>
        <Textarea
          name="description"
          id="description"
          rows="3"
          placeholder="Descripción"
          {...register("description", { required: true })}
        ></Textarea>

        <Label htmlFor="date">Fecha</Label>
        <Input type="date" name="date" {...register("date")} />

        <Label htmlFor="image">Imagen</Label>
        <Input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          {...register("image")}
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mt-2 max-w-xs" />
        )}

        <Label htmlFor="location">Ubicación</Label>
        <AutocompleteInput onSelect={handleLocationSelect} />

        <MapComponent
          location={location}
          onLocationChange={handleLocationSelect}
        />

        <Button type="submit">Guardar</Button>
      </form>
    </Card>
  );
}
