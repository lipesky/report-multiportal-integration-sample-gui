import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env['VITE_API_URL'],
    validateStatus: (status) => {
        return [200, 403].includes(status);
    },
});
api.interceptors.request.use(
    (config) =>{
        const token = window.localStorage.getItem('token');
        config.headers['Authentication'] = token;
        return config;
    }
)
api.interceptors.response.use(
    (response) =>{
        if(response.status == 403){
            window.location.href = window.location.origin+'/#/login';
        }
        return response;
    }
)
export default api;