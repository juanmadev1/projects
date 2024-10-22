import axios from "./axios";

export const getTasksRequest = async () => axios.get("/tasks/user");
export const getAllTasksRequest = async () => axios.get("/tasks");

export const createTaskRequest = async (task) => axios.post("/tasks", task);
export const updateTaskRequest = async (task) =>
  axios.put(`/tasks/${task._id}`, task);
export const deleteTaskRequest = async (id) => axios.delete(`/tasks/${id}`);
export const getTaskRequest = async (id) => axios.get(`/tasks/${id}`);

export const addCommentRequest = (taskId, comment) => axios.post(`/tasks/${taskId}/comments`, comment);

export const getCommentsRequest = (taskId) => axios.get(`/tasks/${taskId}/comments`);

export const deleteCommentRequest = (taskId, commentId) => axios.delete(`/tasks/${taskId}/comments/${commentId}`);
