import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5298/api',
});

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

// API functions
export const getBooks = async (): Promise<Book[]> => {
  const response = await api.get('/books');
  return response.data;
};

export const createBook = async (data: CreateBookDto): Promise<Book> => {
  const response = await api.post('/books', data);
  return response.data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await api.delete(`/books/${id}`);
};

export const searchBooks = async (term: string): Promise<Book[]> => {
  const response = await api.get(`/books/search?term=${encodeURIComponent(term)}`);
  return response.data;
};

export const getMembers = async (): Promise<Member[]> => {
  const response = await api.get('/members');
  return response.data;
};

export const registerMember = async (data: CreateMemberDto): Promise<Member> => {
  const response = await api.post('/members', data);
  return response.data;
};

export const borrowBook = async (data: BorrowBookDto): Promise<void> => {
  await api.post('/borrow/borrow', data);
};

export const returnBook = async (data: BorrowBookDto): Promise<void> => {
  await api.post('/borrow/return', data);
};

export const getBorrowedBooks = async (memberId: string): Promise<Book[]> => {
  const response = await api.get(`/borrow/member/${memberId}`);
  return response.data;
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
