import axios from 'axios';

const request = axios.create({
  baseURL: 'https://localhost:5000/api/v1',
});

request.defaults.withCredentials = true;

//Interceptors are like middleware

request.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // config.headers.common['Authorization'] = '';
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401) {
      //Make immediate action
    }
    return Promise.reject(error);
  }
);

export { request };
