import { useTasks } from "../../context/tasksContext";
import { Button, ButtonLink, Card } from "../ui";

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
            <Button onClick={() => deleteTask(task._id)} className="bg-red-500 hover:bg-red-700">Eliminar</Button>
            <ButtonLink to={`/tasks/${task._id}`}>Edit</ButtonLink>
          </div>
        </header>
        <p className="text-slate-300">{task.description}</p>
        {/* format date */}
        <p>
          {task.date &&
            new Date(task.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </p>
      </div>
    </Card>
  );
}
