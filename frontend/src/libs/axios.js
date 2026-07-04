import axios from 'axios';

const baseURL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://shop-nest-sysmatixx.vercel.app/'; 

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, 
});