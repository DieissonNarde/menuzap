import Parse from 'parse/dist/parse.min.js';

Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
Parse.initialize(
  'Xkz4XEjOGDvSyucqjIPQvC2s15FbbAQFvNp54tlC', // This is your Application ID
  'XjMpmnNihIWJSmGWuVJqxn7JTElyYwCcqNHLoTux' // This is your Javascript key
);

export default Parse;


// import axios from "axios";
// import { getToken } from "./auth";

// const api = axios.create({
//   baseURL: "https://parseapi.back4app.com"
// });

// api.interceptors.request.use(async config => {
//   const token = getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;