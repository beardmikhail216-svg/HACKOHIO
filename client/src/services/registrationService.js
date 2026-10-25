import axios from "axios";

const API = "http://localhost:5000/api/registrations";
const config = { withCredentials: true };

export const registerForProject = (projectId) =>
  axios.post(`${API}/${projectId}`, {}, config);

export const getMyRegistrations = () =>
  axios.get(API, config);

export const getProjectRegistrations = (projectId) =>
  axios.get(`${API}/project/${projectId}`, config);

export const deleteRegistration = (registrationId) =>
  axios.delete(`${API}/${registrationId}`, config);

export const approveRegistration = (registrationId) =>
  axios.put(`${API}/${registrationId}/approve`, {}, config);

export const rejectRegistration = (registrationId) =>
  axios.put(`${API}/${registrationId}/reject`, {}, config);
