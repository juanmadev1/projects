import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllTasksRequest } from "../api/tasks";
import TaskDetailModal from "../components/TaskDetailModal";
import { useAuth } from "../context/authContext";
import { FaStar, FaSearch } from 'react-icons/fa';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await getAllTasksRequest();
        setTasks(res.data);
        setFilteredTasks(res.data);
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const results = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(results);
  }, [searchTerm, tasks]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((star, i) => (
          <FaStar
            key={i}
            className="star"
            color={i < rating ? "#ffc107" : "#e4e5e9"}
            size={16}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="bg-zinc-900 min-h-screen">
      <header className="bg-zinc-800 p-10">
        <h1 className="text-5xl py-2 font-bold text-white">React Tasks</h1>
        {!isAuthenticated ? (
          <>
            <p className="text-md text-slate-400">
              Gestiona tus tareas de manera eficiente con nuestra aplicación.
            </p>
            <Link
              className="bg-indigo-500 text-white px-4 py-2 rounded-md mt-4 inline-block hover:bg-indigo-600 transition-colors"
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

      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Todas las Tareas</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-zinc-700 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-zinc-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleTaskClick(task)}
            >
              {task.image && (
                <img
                  src={task.image}
                  alt={task.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{task.title}</h3>
                <p className="text-slate-300 mb-4 line-clamp-3">{task.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-400">
                    Por: {task.user.username}
                  </p>
                  <StarRating rating={task.averageRating} />
                </div>
              </div>
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
