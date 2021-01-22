import axios from 'axios';

export default async function callApi(userInfo, request, route, params) {
  const config = {
    url: 'http://localhost:9000/api',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
    params,
  };
  if (request === 'post') {
    try {
      const res = await axios[request](`${config.url}${route}`, userInfo, config);
      return res.data;
    } catch (error) {
      if (error.message === 'Network Error') {
        return error.message;
      }
      if (error.response.status === 401) {
        localStorage.removeItem('token');
      }
      return error;
    }
  }
  if (request === 'get') {
    try {
      const res = await axios[request](`${config.url}${route}`, config);
      return res.data;
    } catch (error) {
      if (error.message === 'Network Error') {
        return error.message;
      }
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        return error.response.status;
      }
    }
  }
  if (request === 'put') {
    try {
      const res = await axios[request](`${config.url}${route}`, userInfo, config);
      return res.data;
    } catch (error) {
      if (error.message === 'Network Error') {
        return error.message;
      }
      if (error.response.status === 401) {
        localStorage.removeItem('token');
      }
      return error;
    }
  }
  if (request === 'delete') {
    try {
      const { headers } = config;
      const res = await axios[request](`${config.url}${route}`, { headers, userInfo });
      return res.data;
    } catch (error) {
      if (error.message === 'Network Error') {
        return error.message;
      }
      if (error.response.status === 401) {
        localStorage.removeItem('token');
      }
      return error;
    }
  }
  return '';
}
