import axios from 'axios';

// exp:192.168.0.105:19000
const api = axios.create({
  baseURL: 'https://gesture-light.herokuapp.com',
});

api.interceptors.response.use(
  response => response,
  error => {
    const err = error.response.data;
    throw err;
  }
);

export default api;
