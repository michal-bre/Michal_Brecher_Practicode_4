import axios from "axios";

axios.defaults.baseURL = "http://localhost:5006/api";

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
    const result = await axios.get("/items");
    return result.data;
  },

async addTask(name) {
  const result = await axios.post("/items", {
    name: name,
    isComplete: false
  });
  return result.data;
},

async setCompleted(id, isComplete, currentName) {
  const result = await axios.put(`/items/${id}`, {
    id: id,
    name: currentName,
    isComplete: isComplete
  });
  return result.data;
},

  async deleteTask(id) {
    const result = await axios.delete(`/items/${id}`);
    return result.data;
  },

  async login(username, password) {
    const result = await axios.post("/login", {
      UserName: username,
      Password: password
    });
    localStorage.setItem("token", result.data.token);
    return result.data;
  },

  async register(username, password) {
    const result = await axios.post("/register", {
      UserName: username,
      Password: password
    });
    return result.data;
  }
};
