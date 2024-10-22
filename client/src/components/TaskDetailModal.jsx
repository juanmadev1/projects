import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { addCommentRequest, getCommentsRequest } from '../api/tasks';
import { MapComponent } from './MapComponent';
import { Link } from 'react-router-dom';

function TaskDetailModal({ task, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadComments();
  }, [task._id]);

  const loadComments = async () => {
    try {
      const res = await getCommentsRequest(task._id);
      setComments(res.data);
    } catch (error) {
      console.error("Error al cargar los comentarios:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }
    try {
      await addCommentRequest(task._id, { content: newComment });
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error("Error al añadir el comentario:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-zinc-800 p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">{task.title}</h2>
        {task.image && (
          <img src={task.image} alt={task.title} className="w-full h-64 object-cover mb-4 rounded" />
        )}
        <p className="text-slate-300 mb-4">{task.description}</p>
        <p className="text-sm text-slate-400 mb-4">
          Creado por: {task.user.username}
        </p>
        {task.location && task.location.coordinates && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Ubicación</h3>
            <MapComponent
              location={{
                lng: task.location.coordinates[0],
                lat: task.location.coordinates[1]
              }}
            />
          </div>
        )}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">Comentarios</h3>
          {comments.map((comment, index) => (
            <div key={index} className="bg-zinc-700 p-2 rounded mb-2">
              <p className="text-sm text-slate-300">{comment.content}</p>
              <p className="text-xs text-slate-400">Por: {comment.user.username}</p>
            </div>
          ))}
        </div>
        {isAuthenticated ? (
          <form onSubmit={handleAddComment} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 rounded bg-zinc-700 text-white"
              placeholder="Añade un comentario..."
            />
            <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
              Comentar
            </button>
          </form>
        ) : (
          <div className="mt-4 text-white">
            <p>Debes iniciar sesión para comentar.</p>
            <Link to="/login" className="text-blue-500 hover:underline">
              Iniciar sesión
            </Link>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default TaskDetailModal;
