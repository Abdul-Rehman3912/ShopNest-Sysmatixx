import axios from 'axios';

const apiURL = `${process.env.REACT_APP_API_URL}` 

export const axiosInstance = axios.create({
  baseURL: apiURL,
  withCredentials: true, 
});