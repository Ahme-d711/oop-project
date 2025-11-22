# Library Management System - Documentation

## 1. Project Structure (Packages / Folders)

```
LibraryApp/
├── Models/              # Domain Models
│   ├── Book.cs
│   ├── Person.cs (Abstract)
│   ├── StudentMember.cs
│   ├── TeacherMember.cs
│   ├── Library.cs
│   ├── IBorrowable.cs (Interface)
│   └── Utility.cs (Sealed)
└── Services/
    └── LibraryService.cs

LibraryApp.API/
├── Controllers/        # API Endpoints
│   ├── BooksController.cs
│   ├── MembersController.cs
│   └── BorrowController.cs
└── DTOs/              # Data Transfer Objects
    ├── BookDto.cs
    ├── CreateBookDto.cs
    ├── MemberDto.cs
    ├── CreateMemberDto.cs
    └── BorrowBookDto.cs
```

---

## 2. Class Diagram (Simplified)

```
┌─────────────────────────────────────────────────────────────┐
│                        IBorrowable                          │
│                    (Interface)                              │
├─────────────────────────────────────────────────────────────┤
│ + IsAvailable: bool                                         │
│ + BorrowedByMemberId: string?                               │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ implements
                              │
┌─────────────────────────────────────────────────────────────┐
│                           Book                               │
│                      (Class)                                 │
├─────────────────────────────────────────────────────────────┤
│ - Id: string                                                │
│ - Title: string                                              │
│ - Author: string                                             │
│ - IsAvailable: bool                                         │
│ - BorrowedByMemberId: string?                              │
├─────────────────────────────────────────────────────────────┤
│ + Book()                                                     │
│ + Book(title, author)                                       │
│ + ToString(): string                                        │
│ ~Book() (destructor)                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                          Person                              │
│                    (Abstract Class)                          │
├─────────────────────────────────────────────────────────────┤
│ + Id: string                                                │
│ + Name: string                                              │
│ + Email: string                                             │
├─────────────────────────────────────────────────────────────┤
│ # Person(name, email) (protected constructor)              │
│ + ToString(): string (virtual)                              │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ inherits
                ┌─────────────┴─────────────┐
                │                           │
┌───────────────────────────┐  ┌───────────────────────────┐
│     StudentMember         │  │     TeacherMember         │
│        (Class)            │  │        (Class)            │
├───────────────────────────┤  ├───────────────────────────┤
│ + StudentId: string       │  │ + EmployeeId: string     │
│ + MaxBooksAllowed: int   │  │ + MaxBooksAllowed: int    │
├───────────────────────────┤  ├───────────────────────────┤
│ + StudentMember(...)      │  │ + TeacherMember(...)     │
│ + ToString(): string      │  │ + ToString(): string     │
│   (override)              │  │   (override)             │
└───────────────────────────┘  └───────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                          Library                             │
│                        (Class)                               │
├─────────────────────────────────────────────────────────────┤
│ - _books: List<Book> (private)                             │
│ - _members: List<Person> (private)                         │
│ - _borrowedBooks: Dictionary<string, List<string>>          │
├─────────────────────────────────────────────────────────────┤
│ + Books: IReadOnlyList<Book> (read-only property)          │
│ + Members: IReadOnlyList<Person> (read-only property)     │
├─────────────────────────────────────────────────────────────┤
│ + Library()                                                 │
│ + AddBook(book: Book): void                                │
│ + RemoveBook(bookId: string): bool                         │
│ + RegisterMember(member: Person): void                    │
│ + BorrowBook(bookId, memberId): bool                       │
│ + ReturnBook(bookId, memberId): bool                      │
│ + SearchBooks(term: string): List<Book>                    │
│ + GetBorrowedBooks(memberId: string): List<Book>           │
│ - GetMaxBooksAllowed(member: Person): int (private)       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      LibraryService                          │
│                        (Class)                              │
├─────────────────────────────────────────────────────────────┤
│ + TotalLibrariesCreated: int (static)                      │
│ - _library: Library (private)                             │
├─────────────────────────────────────────────────────────────┤
│ + LibraryService()                                         │
│ + GetLibrary(): Library                                    │
│ + AddBook(title, author): string (overload 1)              │
│ + AddBook(book: Book): string (overload 2)                │
│ + RemoveBook(bookId: string): bool                        │
│ + RegisterMember(...): string                             │
│ + BorrowBook(bookId, memberId): bool                      │
│ + ReturnBook(bookId, memberId): bool                      │
│ + SearchBooks(term: string): List<Book>                   │
│ + GetAllBooks(): List<Book>                                │
│ + GetAllMembers(): List<Person>                            │
│ + GetBorrowedBooks(memberId: string): List<Book>           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                          Utility                            │
│                    (Sealed Class)                           │
├─────────────────────────────────────────────────────────────┤
│ + LibraryName: string (static)                            │
├─────────────────────────────────────────────────────────────┤
│ + GetLibraryInfo(): string (static)                        │
│ - Utility() (private constructor)                        │
└─────────────────────────────────────────────────────────────┘
```

## 3. Class Diagram (Simplified)

```
IBorrowable (Interface)
    ↑ implements
Book

Person (Abstract)
    ↑ inherits
StudentMember | TeacherMember

Library (Encapsulation)
LibraryService (Static members, Method overloading)
Utility (Sealed class)
```

---

## 4. Class Descriptions

### **Book Class**
- **Purpose:** Represents a book entity
- **Features:** Default & parameterized constructors, destructor, implements IBorrowable
- **Properties:** Id, Title, Author, IsAvailable, BorrowedByMemberId

### **Person Class (Abstract)**
- **Purpose:** Base class for all members
- **Features:** Abstract class, protected constructor, virtual ToString()
- **Properties:** Id, Name, Email
- **Inherited by:** StudentMember, TeacherMember

### **StudentMember Class**
- **Purpose:** Represents student member
- **Features:** Inherits Person, overrides ToString(), uses base keyword
- **Properties:** StudentId, MaxBooksAllowed = 3

### **TeacherMember Class**
- **Purpose:** Represents teacher member
- **Features:** Inherits Person, overrides ToString(), uses base keyword
- **Properties:** EmployeeId, MaxBooksAllowed = 5

### **Library Class**
- **Purpose:** Main library management (books & members)
- **Features:** Encapsulation (private fields, public properties), polymorphism
- **Key Methods:**
  - AddBook(), RemoveBook()
  - RegisterMember()
  - BorrowBook(), ReturnBook()
  - SearchBooks()
  - GetBorrowedBooks()
  - GetMaxBooksAllowed() - uses polymorphism

### **LibraryService Class**
- **Purpose:** Service layer with business logic
- **Features:** Static member (TotalLibrariesCreated), method overloading
- **Key Methods:**
  - AddBook() - overloaded (string, string) and (Book)
  - RegisterMember(), BorrowBook(), ReturnBook()
  - SearchBooks(), GetAllBooks(), GetAllMembers()

### **IBorrowable Interface**
- **Purpose:** Contract for borrowable items
- **Properties:** IsAvailable, BorrowedByMemberId

### **Utility Class (Sealed)**
- **Purpose:** Static utility class
- **Features:** Sealed (cannot inherit), static members, private constructor

---

## 5. Program Flow (Tracing)

### **A. Application Startup**
```
1. Program.cs starts
2. Register services (Controllers, Swagger, CORS)
3. Register LibraryService as Singleton
4. InitializeSampleData():
   - Create LibraryService → creates Library instance
   - AddBook() → creates Book objects
   - RegisterMember() → creates StudentMember/TeacherMember objects
```

### **B. API Request Flow (Borrow Book)**
```
1. POST /api/borrow/borrow
2. BorrowController.BorrowBook()
3. LibraryService.BorrowBook()
4. Library.BorrowBook():
   - Find book and member
   - Check availability
   - GetMaxBooksAllowed(member) - POLYMORPHISM:
     * if (member is StudentMember) → return 3
     * if (member is TeacherMember) → return 5
   - Validate limit
   - Update book status
   - Add to borrowedBooks dictionary
5. Return success/error response
```

### **C. Polymorphism Example**
```
GetMaxBooksAllowed(Person member):
  - Receives Person (base class)
  - Runtime type checking:
    * member is StudentMember? → return student.MaxBooksAllowed (3)
    * member is TeacherMember? → return teacher.MaxBooksAllowed (5)
    * else → return 3 (default)
```

### **D. Method Overriding (ToString)**
```
Person.ToString() (virtual):
  → "Name (Email)"

StudentMember.ToString() (override):
  → "Student: " + base.ToString() + " (ID: StudentId)"

TeacherMember.ToString() (override):
  → "Teacher: " + base.ToString() + " (ID: EmployeeId)"
```

---

## 6. OOP Concepts Summary

✅ **Encapsulation** - Private fields in Library class  
✅ **Inheritance** - Person → StudentMember, TeacherMember  
✅ **Polymorphism** - GetMaxBooksAllowed() method  
✅ **Abstraction** - Person abstract class, IBorrowable interface  
✅ **Interface** - IBorrowable  
✅ **Abstract Class** - Person  
✅ **Static Members** - TotalLibrariesCreated, Utility class  
✅ **Instance Members** - All properties and methods  
✅ **Method Overloading** - AddBook() two versions  
✅ **Method Overriding** - ToString() virtual/override  
✅ **Constructors** - Default & parameterized  
✅ **Destructor** - ~Book()  
✅ **Access Modifiers** - public, private, protected  
✅ **Sealed Classes** - Utility  
✅ **Getter/Setter** - Properties  
✅ **Virtual Methods** - Person.ToString()  
✅ **Override Keyword** - StudentMember, TeacherMember  
✅ **Base Keyword** - : base() in constructors  
✅ **This Keyword** - Property assignment  
✅ **Namespaces** - LibraryApp.Models, LibraryApp.Services  

---

## 6. Summary

Complete OOP implementation with:
- All 24 OOP concepts covered
- Clean architecture (Models, Services, API)
- RESTful API for frontend integration
- In-memory data storage
- Full library management functionality
