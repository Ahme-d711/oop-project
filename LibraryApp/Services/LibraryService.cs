using LibraryApp.Models;

namespace LibraryApp.Services;

/// <summary>
/// Service class to handle library operations and business logic
/// </summary>
public class LibraryService
{
    private Library _library;

    public LibraryService()
    {
        _library = new Library();
    }

    public Library GetLibrary() => _library;

    // Add book with validation
    public string AddBook(string title, string author)
    {
        if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(author))
            throw new ArgumentException("Title and author are required.");

        var book = new Book(title, author);
        _library.AddBook(book);
        return book.Id;
    }

    // Remove book with validation
    public bool RemoveBook(string bookId)
    {
        return _library.RemoveBook(bookId);
    }

    // Register member with validation
    public string RegisterMember(string name, string email, string memberType, string idNumber)
    {
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Name and email are required.");

        Person member;
        if (memberType.ToLower() == "student")
        {
            member = new StudentMember(name, email, idNumber);
        }
        else if (memberType.ToLower() == "teacher")
        {
            member = new TeacherMember(name, email, idNumber);
        }
        else
        {
            throw new ArgumentException("Member type must be 'student' or 'teacher'.");
        }

        _library.RegisterMember(member);
        return member.Id;
    }

    // Borrow book with validation
    public bool BorrowBook(string bookId, string memberId)
    {
        return _library.BorrowBook(bookId, memberId);
    }

    // Return book with validation
    public bool ReturnBook(string bookId, string memberId)
    {
        return _library.ReturnBook(bookId, memberId);
    }

    // Search books
    public List<Book> SearchBooks(string searchTerm)
    {
        return _library.SearchBooks(searchTerm);
    }

    // Get all books
    public List<Book> GetAllBooks()
    {
        return _library.Books.ToList();
    }

    // Get all members
    public List<Person> GetAllMembers()
    {
        return _library.Members.ToList();
    }

    // Get borrowed books for a member
    public List<Book> GetBorrowedBooks(string memberId)
    {
        return _library.GetBorrowedBooks(memberId);
    }
}

