import axios from "axios";

const API = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

export const register = (data) =>
  axios.post(`${API}/register`, data);

export const login = (data) =>
  axios.post(`${API}/login`, data);

export const logout = () =>
  axios.post(`${API}/logout`);

export const getCurrentUser = () =>
  axios.get(`${API}/me`);
