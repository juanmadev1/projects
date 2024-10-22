import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllTasksRequest } from "../api/tasks";
import TaskDetailModal from "../components/TaskDetailModal";
import { useAuth } from "../context/authContext";

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await getAllTasksRequest();
        setTasks(res.data);
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
      }
    };
    loadTasks();
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  return (
    <section className="bg-red-500 flex flex-col items-center">
      <header className="bg-zinc-800 p-10 w-full">
        <h1 className="text-5xl py-2 font-bold text-white">React Tasks</h1>
        {!isAuthenticated ? (
          <>
            <p className="text-md text-slate-400">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos
              fugit doloremque molestias recusandae labore repellat amet dicta tempore
              necessitatibus facilis repellendus voluptas ducimus maiores deserunt sed
              quo ratione provident debitis aut, voluptatem aliquam iste blanditiis
              ex? Voluptatibus, fuga quasi necessitatibus cumque optio error enim,
              officia accusantium vitae doloremque, molestias modi.
            </p>
            <Link
              className="bg-zinc-500 text-white px-4 py-2 rounded-md mt-4 inline-block"
              to="/register"
            >
              Empezar
            </Link>
          </>
        ) : (
          <p className="text-md text-slate-400">
            Bienvenido de vuelta, {user.username}! Aquí puedes ver todas las tareas.
          </p>
        )}
      </header>

      <div className="w-full max-w-4xl p-8">
        <h2 className="text-3xl font-bold mb-4 text-white">Todas las Tareas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-zinc-800 p-4 rounded-md cursor-pointer hover:bg-zinc-700 transition-colors"
              onClick={() => handleTaskClick(task)}
            >
              {task.image && (
                <img
                  src={task.image}
                  alt={task.title}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              )}
              <h3 className="text-xl font-semibold text-white">{task.title}</h3>
              <p className="text-slate-300 truncate">{task.description}</p>
              <p className="text-sm text-slate-400 mt-2">
                Creado por: {task.user.username}
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={handleCloseModal} />
      )}
    </section>
  );
}

export default HomePage;
