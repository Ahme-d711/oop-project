# Library Management System - API

## Running the API

```bash
cd LibraryApp.API
dotnet run
```

- HTTP: `http://localhost:5298`
- HTTPS: `https://localhost:7033`
- Swagger: `https://localhost:7033/swagger`

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `POST /api/books` - Create book `{ "title": "...", "author": "..." }`
- `DELETE /api/books/{id}` - Delete book
- `GET /api/books/search?term=...` - Search books

### Members
- `GET /api/members` - Get all members
- `GET /api/members/{id}` - Get member by ID
- `POST /api/members` - Register member `{ "name": "...", "email": "...", "memberType": "student|teacher", "idNumber": "..." }`

### Borrow/Return
- `POST /api/borrow/borrow` - Borrow book `{ "bookId": "...", "memberId": "..." }`
- `POST /api/borrow/return` - Return book `{ "bookId": "...", "memberId": "..." }`
- `GET /api/borrow/member/{memberId}` - Get borrowed books

## Next.js Setup

### 1. Create Project
```bash
npx create-next-app@latest library-frontend
cd library-frontend
npm install axios
```

### 2. API Client (`lib/api.ts`)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5298/api',
});

export const getBooks = () => api.get('/books');
export const createBook = (data: { title: string; author: string }) => 
  api.post('/books', data);
export const deleteBook = (id: string) => api.delete(`/books/${id}`);
export const getMembers = () => api.get('/members');
export const registerMember = (data: any) => api.post('/members', data);
export const borrowBook = (data: { bookId: string; memberId: string }) =>
  api.post('/borrow/borrow', data);
export const returnBook = (data: { bookId: string; memberId: string }) =>
  api.post('/borrow/return', data);
```

### 3. Example Usage
```typescript
import { getBooks, createBook } from '../lib/api';

const books = await getBooks();
await createBook({ title: "Clean Code", author: "Robert Martin" });
```

## Notes

- In-memory storage (data resets on server restart)
- CORS enabled for `localhost:3000` and `localhost:3001`
- Sample data loaded automatically on startup
