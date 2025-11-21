# Library Management System - API Documentation

## Backend API (ASP.NET Core)

### Running the API

```bash
cd LibraryApp.API
dotnet run
```

The API will be available at:
- HTTP: `http://localhost:5298`
- HTTPS: `https://localhost:7033`
- Swagger UI: `https://localhost:7033/swagger`

## API Endpoints

### Books

- **GET** `/api/books` - Get all books
- **GET** `/api/books/{id}` - Get book by ID
- **POST** `/api/books` - Create a new book
  ```json
  {
    "title": "Clean Code",
    "author": "Robert C. Martin"
  }
  ```
- **DELETE** `/api/books/{id}` - Delete a book
- **GET** `/api/books/search?term=clean` - Search books by title or author

### Members

- **GET** `/api/members` - Get all members
- **GET** `/api/members/{id}` - Get member by ID
- **POST** `/api/members` - Register a new member
  ```json
  {
    "name": "Ahmed Mohamed",
    "email": "ahmed@example.com",
    "memberType": "student",
    "idNumber": "STU001"
  }
  ```

### Borrow/Return

- **POST** `/api/borrow/borrow` - Borrow a book
  ```json
  {
    "bookId": "book-id-here",
    "memberId": "member-id-here"
  }
  ```
- **POST** `/api/borrow/return` - Return a book
  ```json
  {
    "bookId": "book-id-here",
    "memberId": "member-id-here"
  }
  ```
- **GET** `/api/borrow/member/{memberId}` - Get borrowed books for a member

## Frontend Setup (Next.js)

### 1. Create Next.js Project

```bash
npx create-next-app@latest library-frontend
cd library-frontend
```

### 2. Install Dependencies

```bash
npm install axios
# or
yarn add axios
```

### 3. Create API Client

Create `lib/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5298/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Books
export const getBooks = () => api.get('/books');
export const getBook = (id: string) => api.get(`/books/${id}`);
export const createBook = (data: { title: string; author: string }) => 
  api.post('/books', data);
export const deleteBook = (id: string) => api.delete(`/books/${id}`);
export const searchBooks = (term: string) => 
  api.get(`/books/search?term=${term}`);

// Members
export const getMembers = () => api.get('/members');
export const getMember = (id: string) => api.get(`/members/${id}`);
export const registerMember = (data: {
  name: string;
  email: string;
  memberType: string;
  idNumber: string;
}) => api.post('/members', data);

// Borrow
export const borrowBook = (data: { bookId: string; memberId: string }) =>
  api.post('/borrow/borrow', data);
export const returnBook = (data: { bookId: string; memberId: string }) =>
  api.post('/borrow/return', data);
export const getBorrowedBooks = (memberId: string) =>
  api.get(`/borrow/member/${memberId}`);
```

### 4. Example Page Component

Create `pages/books.tsx` or `app/books/page.tsx` (depending on Next.js version):

```typescript
import { useState, useEffect } from 'react';
import { getBooks, createBook, deleteBook } from '../lib/api';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', author: '' });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBook(formData);
      setFormData({ title: '', author: '' });
      fetchBooks();
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Library Books</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
        <button type="submit">Add Book</button>
      </form>

      <ul>
        {books.map((book: any) => (
          <li key={book.id}>
            {book.title} by {book.author} 
            {book.isAvailable ? ' [Available]' : ' [Borrowed]'}
            <button onClick={() => handleDelete(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 5. Configure CORS (if needed)

The API already has CORS configured for `http://localhost:3000` and `http://localhost:3001`.

If you need to add more origins, edit `LibraryApp.API/Program.cs`:

```csharp
policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "https://yourdomain.com")
```

### 6. Run Both Projects

**Terminal 1 - Backend:**
```bash
cd LibraryApp.API
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd library-frontend
npm run dev
```

## Notes

- The API uses in-memory storage, so data will be reset when the server restarts
- Sample data is automatically loaded when the API starts
- All endpoints return JSON responses
- Error responses follow the format: `{ "message": "error message" }`

