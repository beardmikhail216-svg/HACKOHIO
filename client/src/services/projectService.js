import axios from "axios";

const API = "http://localhost:5000/api/projects";

export const getProjects = () => axios.get(API);

export const createProject = (projectData) =>
  axios.post(API, projectData);

export const updateProject = (projectId, projectData) =>
  axios.put(`${API}/${projectId}`, projectData);

export const deleteProject = (projectId) =>
  axios.delete(`${API}/${projectId}`);
