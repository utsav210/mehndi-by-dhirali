import type { ApiError } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`, window.location.origin)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    return url.toString()
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorDetail = 'An unexpected error occurred'
      try {
        const errorBody: ApiError = await response.json()
        errorDetail = errorBody.detail || errorDetail
      } catch {
        errorDetail = response.statusText || errorDetail
      }
      throw new ApiClientError(errorDetail, response.status)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json() as Promise<T>
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {}
    const url = this.buildUrl(path, params)
    const response = await fetch(url, {
      ...fetchOptions,
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        ...fetchOptions?.headers,
      },
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {}
    const url = this.buildUrl(path, params)
    const isFormData = body instanceof FormData
    const response = await fetch(url, {
      ...fetchOptions,
      method: 'POST',
      credentials: 'include',
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        'Accept': 'application/json',
        ...fetchOptions?.headers,
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    })
    return this.handleResponse<T>(response)
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {}
    const url = this.buildUrl(path, params)
    const response = await fetch(url, {
      ...fetchOptions,
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...fetchOptions?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    return this.handleResponse<T>(response)
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {}
    const url = this.buildUrl(path, params)
    const response = await fetch(url, {
      ...fetchOptions,
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        ...fetchOptions?.headers,
      },
    })
    return this.handleResponse<T>(response)
  }
}

export class ApiClientError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
