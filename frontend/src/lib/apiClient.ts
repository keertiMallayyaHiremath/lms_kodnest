import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL } from './config';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const response = await this.refreshToken();
            const newToken = response.data.accessToken;
            
            localStorage.setItem('accessToken', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('accessToken');
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<AxiosResponse> {
    return this.client.post('/api/auth/refresh');
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.client.post('/api/auth/login', {
      email,
      password,
    });
    
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    
    return response.data;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.client.post('/api/auth/register', {
      email,
      password,
      name,
    });
    
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    
    return response.data;
  }

  async logout() {
    try {
      await this.client.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
    }
  }

  // Subjects methods
  async getSubjects(page = 1, pageSize = 10, query?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (query) {
      params.append('q', query);
    }

    return this.client.get(`/api/subjects?${params}`);
  }

  async getSubject(id: string) {
    return this.client.get(`/api/subjects/${id}`);
  }

  async getSubjectTree(id: string) {
    return this.client.get(`/api/subjects/${id}/tree`);
  }

  async getFirstUnlockedVideo(subjectId: string) {
    return this.client.get(`/api/subjects/${subjectId}/first-video`);
  }

  // Videos methods
  async getVideo(id: string) {
    return this.client.get(`/api/videos/${id}`);
  }

  async getVideosBySubject(subjectId: string) {
    return this.client.get(`/api/videos/subject/${subjectId}`);
  }

  // Progress methods
  async updateVideoProgress(videoId: string, lastPositionSeconds: number, isCompleted: boolean) {
    return this.client.post(`/api/progress/videos/${videoId}`, {
      last_position_seconds: lastPositionSeconds,
      is_completed: isCompleted,
    });
  }

  async getVideoProgress(videoId: string) {
    return this.client.get(`/api/progress/videos/${videoId}`);
  }

  async getSubjectProgress(subjectId: string) {
    return this.client.get(`/api/progress/subjects/${subjectId}`);
  }

  async getProgressSummary() {
    return this.client.get('/api/progress/summary');
  }

  // Generic methods
  async get(url: string) {
    return this.client.get(url);
  }

  async post(url: string, data?: any) {
    return this.client.post(url, data);
  }

  async put(url: string, data?: any) {
    return this.client.put(url, data);
  }

  async delete(url: string) {
    return this.client.delete(url);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
