
import axios from "axios";

const API = "http://localhost:5000/api/recommendations";
const config = { withCredentials: true };

export const getRecommendations = () =>
  axios.get(API, config);
