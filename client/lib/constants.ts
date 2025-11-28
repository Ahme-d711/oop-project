/**
 * Application Constants
 * Centralized constants for better maintainability
 */

export const MEMBER_TYPES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
} as const

export type MemberType = typeof MEMBER_TYPES[keyof typeof MEMBER_TYPES]

export const BOOK_STATUS = {
  AVAILABLE: 'available',
  BORROWED: 'borrowed',
  ALL: 'all',
} as const

export type BookStatus = typeof BOOK_STATUS[keyof typeof BOOK_STATUS]

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

export const API_TIMEOUT = 10000 // 10 seconds

export const DEBOUNCE_DELAY = 300 // milliseconds

