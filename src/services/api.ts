import axios from 'axios';
import config from '../config';

// 定义接口返回类型
interface LoginResponse {
  success: boolean;
  token: string;
  message?: string;
}

// 创建 axios 实例
const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true, // 允许跨域请求携带凭证
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: any) => response.data,
  (error) => {
    if (error.response) {
      // 处理错误响应
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/sign-in';
          break;
        case 403:
          // 权限不足
          console.error('权限不足');
          break;
        case 404:
          // 资源不存在
          console.error('请求的资源不存在');
          break;
        case 500:
          // 服务器错误
          console.error('服务器错误');
          break;
        default:
          console.error('发生错误:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// 定义 API 方法
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/user/login', { email, password });
    console.log(response.data);
    return response.data;
  },
};

// 可以添加其他模块的 API
export const userAPI = {
  // 用户相关的 API 方法
};

export const otherAPI = {
  // 其他模块的 API 方法
};

export default api; 