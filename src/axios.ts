import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://10.248.153.74:9999',
  timeout: 50000,
});

instance.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('x-token'))
      ?.split('=')[1];
    if (token) {
      config.headers['x-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
