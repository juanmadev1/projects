import React from "react";

function TaskDetailModal({ task, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-zinc-800 p-6 rounded-lg max-w-md w-full">
        {task.image && (
          <img
            src={task.image}
            alt={task.title}
            className="w-full h-48 object-cover mb-4 rounded"
          />
        )}
        <h2 className="text-2xl font-bold text-white mb-4">{task.title}</h2>
        <p className="text-slate-300 mb-4">{task.description}</p>
        <p className="text-sm text-slate-400 mb-4">
          Creado por: {task.user.username}
        </p>
        <p className="text-sm text-slate-400 mb-4">
          Fecha: {new Date(task.date).toLocaleDateString()}
        </p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default TaskDetailModal;
