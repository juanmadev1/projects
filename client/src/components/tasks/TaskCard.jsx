import { useTasks } from "../../context/tasksContext";
import { Button, ButtonLink, Card } from "../ui";
import { MapComponent } from "../MapComponent";

export function TaskCard({ task }) {
  const { deleteTask } = useTasks();

  return (
    <Card className="overflow-hidden">
      {task.image && (
        <img
          src={task.image}
          alt={task.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">{task.title}</h1>
          <div className="flex gap-x-2">
            <Button onClick={() => deleteTask(task._id)} className="bg-red-500 hover:bg-red-600">Eliminar</Button>
            <ButtonLink to={`/tasks/${task._id}`} className="bg-blue-500 hover:bg-blue-600">Editar</ButtonLink>
          </div>
        </header>
        <p className="text-slate-300 mb-4">{task.description}</p>
        <p className="text-sm text-slate-400 mb-4">
          Fecha: {" "}
          {task.date &&
            new Date(task.date).toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </p>
        {task.location && task.location.coordinates && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-white mb-2">Ubicación</h2>
            <MapComponent
              location={{
                lng: task.location.coordinates[0],
                lat: task.location.coordinates[1]
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
