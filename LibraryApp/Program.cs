using LibraryApp.Models;
using LibraryApp.Services;

namespace LibraryApp;

/// <summary>
/// Main program entry point - Console UI
/// </summary>
class Program
{
    private static LibraryService _libraryService = new LibraryService();

    static void Main(string[] args)
    {
        Console.WriteLine("=== Library Management System ===\n");

        // Add some sample data
        InitializeSampleData();

        bool exit = false;
        while (!exit)
        {
            ShowMainMenu();
            string? choice = Console.ReadLine();

            switch (choice)
            {
                case "1":
                    AddBookMenu();
                    break;
                case "2":
                    RegisterMemberMenu();
                    break;
                case "3":
                    BorrowBookMenu();
                    break;
                case "4":
                    ReturnBookMenu();
                    break;
                case "5":
                    ShowAllBooks();
                    break;
                case "6":
                    ShowAllMembers();
                    break;
                case "7":
                    SearchBooksMenu();
                    break;
                case "8":
                    ShowBorrowedBooksMenu();
                    break;
                case "0":
                    exit = true;
                    Console.WriteLine("Thank you for using the system!");
                    break;
                default:
                    Console.WriteLine("Invalid choice. Please try again.");
                    break;
            }

            if (!exit)
            {
                Console.WriteLine("\nPress Enter to continue...");
                Console.ReadLine();
                Console.Clear();
            }
        }
    }

    static void ShowMainMenu()
    {
        Console.WriteLine("=== Main Menu ===");
        Console.WriteLine("1. Add Book");
        Console.WriteLine("2. Register Member");
        Console.WriteLine("3. Borrow Book");
        Console.WriteLine("4. Return Book");
        Console.WriteLine("5. Show All Books");
        Console.WriteLine("6. Show All Members");
        Console.WriteLine("7. Search Books");
        Console.WriteLine("8. Show Borrowed Books");
        Console.WriteLine("0. Exit");
        Console.Write("\nChoose number: ");
    }

    static void AddBookMenu()
    {
        Console.WriteLine("\n=== Add Book ===");
        Console.Write("Book Title: ");
        string? title = Console.ReadLine();
        Console.Write("Author Name: ");
        string? author = Console.ReadLine();

        try
        {
            if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(author))
            {
                Console.WriteLine("Error: Title and author are required.");
                return;
            }

            string bookId = _libraryService.AddBook(title, author);
            Console.WriteLine($"Book added successfully! (ID: {bookId})");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }

    static void RegisterMemberMenu()
    {
        Console.WriteLine("\n=== Register Member ===");
        Console.Write("Name: ");
        string? name = Console.ReadLine();
        Console.Write("Email: ");
        string? email = Console.ReadLine();
        Console.Write("Member Type (student/teacher): ");
        string? memberType = Console.ReadLine();
        Console.Write("ID Number: ");
        string? idNumber = Console.ReadLine();

        try
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email) || 
                string.IsNullOrWhiteSpace(memberType) || string.IsNullOrWhiteSpace(idNumber))
            {
                Console.WriteLine("Error: All fields are required.");
                return;
            }

            string memberId = _libraryService.RegisterMember(name, email, memberType, idNumber);
            Console.WriteLine($"Member registered successfully! (ID: {memberId})");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }

    static void BorrowBookMenu()
    {
        Console.WriteLine("\n=== Borrow Book ===");
        ShowAllBooks();
        Console.Write("\nBook ID: ");
        string? bookId = Console.ReadLine();
        Console.Write("Member ID: ");
        string? memberId = Console.ReadLine();

        try
        {
            if (string.IsNullOrWhiteSpace(bookId) || string.IsNullOrWhiteSpace(memberId))
            {
                Console.WriteLine("Error: Book ID and Member ID are required.");
                return;
            }

            bool success = _libraryService.BorrowBook(bookId, memberId);
            if (success)
                Console.WriteLine("Book borrowed successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }

    static void ReturnBookMenu()
    {
        Console.WriteLine("\n=== Return Book ===");
        Console.Write("Book ID: ");
        string? bookId = Console.ReadLine();
        Console.Write("Member ID: ");
        string? memberId = Console.ReadLine();

        try
        {
            if (string.IsNullOrWhiteSpace(bookId) || string.IsNullOrWhiteSpace(memberId))
            {
                Console.WriteLine("Error: Book ID and Member ID are required.");
                return;
            }

            bool success = _libraryService.ReturnBook(bookId, memberId);
            if (success)
                Console.WriteLine("Book returned successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }

    static void ShowAllBooks()
    {
        Console.WriteLine("\n=== All Books ===");
        var books = _libraryService.GetAllBooks();
        if (books.Count == 0)
        {
            Console.WriteLine("No books available.");
            return;
        }

        foreach (var book in books)
        {
            Console.WriteLine(book.ToString());
        }
    }

    static void ShowAllMembers()
    {
        Console.WriteLine("\n=== All Members ===");
        var members = _libraryService.GetAllMembers();
        if (members.Count == 0)
        {
            Console.WriteLine("No members registered.");
            return;
        }

        foreach (var member in members)
        {
            Console.WriteLine(member.ToString());
        }
    }

    static void SearchBooksMenu()
    {
        Console.WriteLine("\n=== Search Books ===");
        Console.Write("Enter search term (title or author): ");
        string? searchTerm = Console.ReadLine();

        try
        {
            var results = _libraryService.SearchBooks(searchTerm ?? "");
            if (results.Count == 0)
            {
                Console.WriteLine("No results found.");
                return;
            }

            Console.WriteLine($"\nFound {results.Count} book(s):");
            foreach (var book in results)
            {
                Console.WriteLine(book.ToString());
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }

    static void ShowBorrowedBooksMenu()
    {
        Console.WriteLine("\n=== Borrowed Books ===");
        Console.Write("Member ID: ");
        string? memberId = Console.ReadLine();

        try
        {
            if (string.IsNullOrWhiteSpace(memberId))
            {
                Console.WriteLine("Error: Member ID is required.");
                return;
            }

            var books = _libraryService.GetBorrowedBooks(memberId);
            if (books.Count == 0)
            {
                Console.WriteLine("No borrowed books.");
                return;
            }

            Console.WriteLine($"Borrowed books ({books.Count}):");
            foreach (var book in books)
            {
                Console.WriteLine(book.ToString());
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }

    static void InitializeSampleData()
    {
        // Add sample books
        _libraryService.AddBook("Clean Code", "Robert C. Martin");
        _libraryService.AddBook("Design Patterns", "Gang of Four");
        _libraryService.AddBook("The Pragmatic Programmer", "Andrew Hunt");

        // Add sample members
        _libraryService.RegisterMember("Ahmed Mohamed", "ahmed@example.com", "student", "STU001");
        _libraryService.RegisterMember("Fatima Ali", "fatima@example.com", "teacher", "TCH001");
    }
}
