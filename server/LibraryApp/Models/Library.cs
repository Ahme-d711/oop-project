using System.Collections.Generic;

namespace LibraryApp.Models;

/// <summary>
/// Main Library class that manages books and members
/// </summary>
public class Library
{
    // In-memory storage (no database)
    private List<Book> _books;
    private List<Person> _members;
    private Dictionary<string, List<string>> _borrowedBooks; // memberId -> list of bookIds

    public Library()
    {
        _books = new List<Book>();
        _members = new List<Person>();
        _borrowedBooks = new Dictionary<string, List<string>>();
    }

    // Properties with encapsulation (getters)
    public IReadOnlyList<Book> Books => _books.AsReadOnly();
    public IReadOnlyList<Person> Members => _members.AsReadOnly();

    // Add a book to the library
    public void AddBook(Book book)
    {
        if (book == null)
            throw new ArgumentNullException(nameof(book));
        
        _books.Add(book);
    }

    // Remove a book from the library
    public bool RemoveBook(string bookId)
    {
        var book = _books.FirstOrDefault(b => b.Id == bookId);
        if (book == null)
            return false;

        if (!book.IsAvailable)
            throw new InvalidOperationException("Cannot remove a book that is currently borrowed.");

        _books.Remove(book);
        return true;
    }

    // Register a new member
    public void RegisterMember(Person member)
    {
        if (member == null)
            throw new ArgumentNullException(nameof(member));

        if (_members.Any(m => m.Id == member.Id))
            throw new InvalidOperationException("Member already exists.");

        _members.Add(member);
        _borrowedBooks[member.Id] = new List<string>();
    }

    // Remove a member from the library
    public bool RemoveMember(string memberId)
    {
        var member = _members.FirstOrDefault(m => m.Id == memberId);
        if (member == null)
            return false;

        // Check if member has borrowed books
        if (_borrowedBooks.ContainsKey(memberId) && _borrowedBooks[memberId].Count > 0)
            throw new InvalidOperationException("Cannot remove a member who has borrowed books. Please return all books first.");

        _members.Remove(member);
        _borrowedBooks.Remove(memberId);
        return true;
    }

    // Borrow a book
    public bool BorrowBook(string bookId, string memberId)
    {
        var book = _books.FirstOrDefault(b => b.Id == bookId);
        if (book == null)
            throw new ArgumentException("Book not found.");

        var member = _members.FirstOrDefault(m => m.Id == memberId);
        if (member == null)
            throw new ArgumentException("Member not found.");

        if (!book.IsAvailable)
            throw new InvalidOperationException("Book is not available.");

        // Check max books allowed (Polymorphism)
        int maxBooks = GetMaxBooksAllowed(member);
        int currentBorrowed = _borrowedBooks[memberId].Count;

        if (currentBorrowed >= maxBooks)
            throw new InvalidOperationException($"Member has reached the maximum limit of {maxBooks} books.");

        // Borrow the book
        book.IsAvailable = false;
        book.BorrowedByMemberId = memberId;
        _borrowedBooks[memberId].Add(bookId);

        return true;
    }

    // Return a book
    public bool ReturnBook(string bookId, string memberId)
    {
        var book = _books.FirstOrDefault(b => b.Id == bookId);
        if (book == null)
            throw new ArgumentException("Book not found.");

        if (book.IsAvailable)
            throw new InvalidOperationException("Book is not currently borrowed.");

        if (book.BorrowedByMemberId != memberId)
            throw new InvalidOperationException("This book was not borrowed by this member.");

        // Return the book
        book.IsAvailable = true;
        book.BorrowedByMemberId = null;
        _borrowedBooks[memberId].Remove(bookId);

        return true;
    }

    // Search books by title or author
    public List<Book> SearchBooks(string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
            return _books.ToList();

        searchTerm = searchTerm.ToLower();
        return _books.Where(b => 
            b.Title.ToLower().Contains(searchTerm) || 
            b.Author.ToLower().Contains(searchTerm)
        ).ToList();
    }

    // Get max books allowed for a member (Polymorphism)
    private int GetMaxBooksAllowed(Person member)
    {
        if (member is StudentMember student)
            return student.MaxBooksAllowed;
        if (member is TeacherMember teacher)
            return teacher.MaxBooksAllowed;
        return 3; // default
    }

    // Get borrowed books for a member
    public List<Book> GetBorrowedBooks(string memberId)
    {
        if (!_borrowedBooks.ContainsKey(memberId))
            return new List<Book>();

        return _borrowedBooks[memberId]
            .Select(bookId => _books.FirstOrDefault(b => b.Id == bookId))
            .Where(book => book != null)
            .ToList()!;
    }
}

