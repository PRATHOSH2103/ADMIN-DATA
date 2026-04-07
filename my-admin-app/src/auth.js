import axios from "axios"


const authAxios = axios.create({
    baseURL: "http://localhost:4004/api",
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
    }

});

authAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);


export { authAxios }

