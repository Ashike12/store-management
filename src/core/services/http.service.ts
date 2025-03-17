export interface ApiResponse<T = any> {
  data: T;
  error: string | null;
}

class HttpService {
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {data: null as T, error: errorData.Message || 'An error occurred'};
    }

    try {
      const data = await response.json();
      return {data, error: null};
    } catch {
      return {data: null as T, error: 'Failed to parse response'};
    }
  }

  async get<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`$${endpoint}`, {
        method: 'GET',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async post<T>(
    endpoint: string,
    payload: object,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(payload),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async postURLencoded<T>(
    endpoint: string,
    payload: URLSearchParams,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        ...options,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...options.headers,
        },
        body: payload,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async put<T>(
    endpoint: string,
    payload: object,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${endpoint}`, {
        method: 'PUT',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(payload),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async delete<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${endpoint}`, {
        ...options,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
}
export const ClientHttpService = new HttpService();
