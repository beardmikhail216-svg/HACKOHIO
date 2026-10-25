import axios from "axios";

const API = "http://localhost:5000/api/projects";
const config = { withCredentials: true };

export const getProjects = () =>
  axios.get(API, config);

export const getProject = (projectId) =>
  axios.get(`${API}/${projectId}`, config);

export const createProject = (projectData) =>
  axios.post(API, projectData, config);

export const updateProject = (projectId, projectData) =>
  axios.put(`${API}/${projectId}`, projectData, config);

export const deleteProject = (projectId) =>
  axios.delete(`${API}/${projectId}`, config);
