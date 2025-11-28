import axios from 'axios';
import { ApiError, handleApiError } from './errors';
import { API_TIMEOUT } from './constants';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5298/api',
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token or other headers if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Transform axios errors to ApiError
    if (axios.isAxiosError(error)) {
      const apiError = new ApiError(
        error.response?.data?.message || error.message || 'حدث خطأ غير متوقع',
        error.response?.status,
        error.response?.data
      );
      return Promise.reject(apiError);
    }
    return Promise.reject(error);
  }
);

// Book interfaces
export interface Book {
  id: string;
  title: string;
  author: string;
  isAvailable: boolean;
  borrowedByMemberId?: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
}

// Member interfaces
export interface Member {
  id: string;
  name: string;
  email: string;
  memberType: 'student' | 'teacher';
  idNumber: string;
}

export interface CreateMemberDto {
  name: string;
  email: string;
  memberType: 'student' | 'teacher';
  idNumber: string;
}

// Borrow interfaces
export interface BorrowBookDto {
  bookId: string;
  memberId: string;
}

// API functions with proper error handling
export const getBooks = async (): Promise<Book[]> => {
  try {
    const response = await api.get<Book[]>('/books');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBook = async (data: CreateBookDto): Promise<Book> => {
  try {
    const response = await api.post<Book>('/books', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBook = async (id: string): Promise<void> => {
  try {
    await api.delete(`/books/${id}`);
  } catch (error) {
    throw error;
  }
};

export const searchBooks = async (term: string): Promise<Book[]> => {
  try {
    const response = await api.get<Book[]>(`/books/search?term=${encodeURIComponent(term)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMembers = async (): Promise<Member[]> => {
  try {
    const response = await api.get<Member[]>('/members');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerMember = async (data: CreateMemberDto): Promise<Member> => {
  try {
    const response = await api.post<Member>('/members', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMember = async (id: string): Promise<void> => {
  try {
    await api.delete(`/members/${id}`);
  } catch (error) {
    throw error;
  }
};

export const borrowBook = async (data: BorrowBookDto): Promise<void> => {
  try {
    await api.post('/borrow/borrow', data);
  } catch (error) {
    throw error;
  }
};

export const returnBook = async (data: BorrowBookDto): Promise<void> => {
  try {
    await api.post('/borrow/return', data);
  } catch (error) {
    throw error;
  }
};

export const getBorrowedBooks = async (memberId: string): Promise<Book[]> => {
  try {
    const response = await api.get<Book[]>(`/borrow/member/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Analytics functions
export const getLibraryStats = async () => {
  const [books, members] = await Promise.all([
    getBooks(),
    getMembers()
  ]);

  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.isAvailable).length;
  const borrowedBooks = totalBooks - availableBooks;
  const totalMembers = members.length;
  const studentMembers = members.filter(member => member.memberType === 'student').length;
  const teacherMembers = members.filter(member => member.memberType === 'teacher').length;

  return {
    totalBooks,
    availableBooks,
    borrowedBooks,
    totalMembers,
    studentMembers,
    teacherMembers,
    books,
    members
  };
};
