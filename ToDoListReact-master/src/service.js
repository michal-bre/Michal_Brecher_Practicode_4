import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.get("/api/items");

axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default {
  async getTasks() {
    const result = await axios.get("/api/items");
    return result.data;
  },

  async addTask(name) {
    const result = await axios.post("/api/items", {
      name: name,
      isComplete: false
    });
    return result.data;
  },

  async setCompleted(id, isComplete, currentName) {
    const result = await axios.put(`/api/items/${id}`, {
      id: id,
      name: currentName,
      isComplete: isComplete
    });
    return result.data;
  },

  async deleteTask(id) {
    const result = await axios.delete(`/api/items/${id}`);
    return result.data;
  },

  async login(username, password) {
    const result = await axios.post("api/login", {
      UserName: username,
      Password: password
    });
    localStorage.setItem("token", result.data.token);
    return result.data;
  },

  async register(username, password) {
    const result = await axios.post("api/register", {
      UserName: username,
      Password: password
    });
    return result.data;
  }
};
