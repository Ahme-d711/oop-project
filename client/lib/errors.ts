import axios from 'axios'

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

/**
 * Error response structure from API
 */
interface ApiErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

/**
 * Handles API errors and returns a user-friendly message
 */
export function handleApiError(error: unknown): string {
  // Axios errors
  if (axios.isAxiosError(error)) {
    const response = error.response
    const data = response?.data as ApiErrorResponse | undefined

    // Try to get error message from response
    if (data?.message) {
      return data.message
    }

    if (data?.error) {
      return data.error
    }

    // Handle validation errors
    if (data?.errors) {
      const firstError = Object.values(data.errors)[0]
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0]
      }
    }

    // Handle HTTP status codes
    switch (response?.status) {
      case 400:
        return 'طلب غير صحيح. يرجى التحقق من البيانات المدخلة.'
      case 401:
        return 'غير مصرح. يرجى تسجيل الدخول.'
      case 403:
        return 'غير مسموح. ليس لديك صلاحية للقيام بهذا الإجراء.'
      case 404:
        return 'المورد المطلوب غير موجود.'
      case 409:
        return 'تعارض في البيانات. يرجى المحاولة مرة أخرى.'
      case 500:
        return 'خطأ في الخادم. يرجى المحاولة لاحقاً.'
      case 503:
        return 'الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً.'
      default:
        return error.message || 'حدث خطأ غير متوقع'
    }
  }

  // Custom ApiError
  if (error instanceof ApiError) {
    return error.message
  }

  // Generic Error
  if (error instanceof Error) {
    return error.message
  }

  // Unknown error
  return 'حدث خطأ غير متوقع'
}

/**
 * Checks if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return !error.response && error.request
  }
  return false
}

/**
 * Gets HTTP status code from error
 */
export function getErrorStatusCode(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) {
    return error.response?.status
  }
  if (error instanceof ApiError) {
    return error.statusCode
  }
  return undefined
}

