using LibraryApp.Models;
using Xunit;

namespace Library.Tests;

/// <summary>
/// Unit tests for Library class operations
/// </summary>
public class LibraryTests
{
    [Fact]
    public void AddBook_ShouldAddBookToLibrary()
    {
        // Arrange
        var library = new LibraryApp.Models.Library();
        var book = new Book("Test Book", "Test Author");

        // Act
        library.AddBook(book);

        // Assert
        Assert.Single(library.Books);
        Assert.Equal(book, library.Books.First());
    }

    [Fact]
    public void AddBook_WithNullBook_ShouldThrowException()
    {
        // Arrange
        var library = new LibraryApp.Models.Library();

        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => library.AddBook(null!));
    }

    [Fact]
    public void RemoveBook_ShouldRemoveBookFromLibrary()
    {
        // Arrange
        var library = new LibraryApp.Models.Library();
        var book = new Book("Test Book", "Test Author");
        library.AddBook(book);

        // Act
        bool result = library.RemoveBook(book.Id);

        // Assert
        Assert.True(result);
        Assert.Empty(library.Books);
    }

    [Fact]
    public void RemoveBook_WhenBookIsBorrowed_ShouldThrowException()
    {
        // Arrange
        var library = new LibraryApp.Models.Library();
        var book = new Book("Test Book", "Test Author");
        var member = new StudentMember("Ahmed", "ahmed@test.com", "STU001");
        library.AddBook(book);
        library.RegisterMember(member);
        library.BorrowBook(book.Id, member.Id);

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => library.RemoveBook(book.Id));
    }

    [Fact]
    public void RegisterMember_ShouldAddMemberToLibrary()
    {
        // Arrange
        var library = new LibraryApp.Models.Library();
        var member = new StudentMember("Ahmed", "ahmed@test.com", "STU001");

        // Act
        library.RegisterMember(member);

        // Assert
        Assert.Single(library.Members);
        Assert.Equal(member, library.Members.First());
    }

    [Fact]
    public void BorrowBook_ShouldBorrowBookSuccessfully()
    {
        // Arrange
        var library = new LibraryApp.Models.Library();
        var book = new Book("Test Book", "Test Author");
        var member = new StudentMember("Ahmed", "ahmed@test.com", "STU001");
        library.AddBook(book);
        library.RegisterMember(member);

        // Act
        bool result = library.BorrowBook(book.Id, member.Id);

        // Assert
        Assert.True(result);
        Assert.False(book.IsAvailable);
        Assert.Equal(member.Id, book.BorrowedByMemberId);
    }

    [Fact]
    public void BorrowBook_WhenBookNotAvailable_ShouldThrowException()
    {
        // Arrange
        var library = new LibraryApp.Models.Library();
        var book = new Book("Test Book", "Test Author");
        var member1 = new StudentMember("Ahmed", "ahmed@test.com", "STU001");
        var member2 = new StudentMember("Fatima", "fatima@test.com", "STU002");
        library.AddBook(book);
        library.RegisterMember(member1);
        library.RegisterMember(member2);
        library.BorrowBook(book.Id, member1.Id);

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => library.BorrowBook(book.Id, member2.Id));
    }

    [Fact]
    public void BorrowBook_WhenMaxBooksReached_ShouldThrowException()
    {
        // Arrange
        var library = new LibraryApp.Models.Library();
        var member = new StudentMember("Ahmed", "ahmed@test.com", "STU001");
        library.RegisterMember(member);

        // Add 3 books (max for student)
        for (int i = 1; i <= 3; i++)
        {
            var book = new Book($"Book {i}", "Author");
            library.AddBook(book);
            library.BorrowBook(book.Id, member.Id);
        }

        // Try to borrow 4th book
        var book4 = new Book("Book 4", "Author");
        library.AddBook(book4);

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => library.BorrowBook(book4.Id, member.Id));
    }

    [Fact]
    public void ReturnBook_ShouldReturnBookSuccessfully()
    {
        // Arrange
        var library = new LibraryApp.Models.Library();
        var book = new Book("Test Book", "Test Author");
        var member = new StudentMember("Ahmed", "ahmed@test.com", "STU001");
        library.AddBook(book);
        library.RegisterMember(member);
        library.BorrowBook(book.Id, member.Id);

        // Act
        bool result = library.ReturnBook(book.Id, member.Id);

        // Assert
        Assert.True(result);
        Assert.True(book.IsAvailable);
        Assert.Null(book.BorrowedByMemberId);
    }

    [Fact]
    public void SearchBooks_ShouldFindBooksByTitle()
    {
        // Arrange
        var library = new LibraryApp.Models.Library();
        library.AddBook(new Book("Clean Code", "Robert Martin"));
        library.AddBook(new Book("Design Patterns", "Gang of Four"));
        library.AddBook(new Book("The Pragmatic Programmer", "Andrew Hunt"));

        // Act
        var results = library.SearchBooks("Clean");

        // Assert
        Assert.Single(results);
        Assert.Equal("Clean Code", results.First().Title);
    }

    [Fact]
    public void SearchBooks_ShouldFindBooksByAuthor()
    {
        // Arrange
        var library = new LibraryApp.Models.Library();
        library.AddBook(new Book("Clean Code", "Robert Martin"));
        library.AddBook(new Book("Design Patterns", "Gang of Four"));

        // Act
        var results = library.SearchBooks("Martin");

        // Assert
        Assert.Single(results);
        Assert.Equal("Robert Martin", results.First().Author);
    }

    [Fact]
    public void GetBorrowedBooks_ShouldReturnBorrowedBooksForMember()
    {
        // Arrange
        var library = new LibraryApp.Models.Library();
        var member = new StudentMember("Ahmed", "ahmed@test.com", "STU001");
        var book1 = new Book("Book 1", "Author");
        var book2 = new Book("Book 2", "Author");
        library.AddBook(book1);
        library.AddBook(book2);
        library.RegisterMember(member);
        library.BorrowBook(book1.Id, member.Id);
        library.BorrowBook(book2.Id, member.Id);

        // Act
        var borrowedBooks = library.GetBorrowedBooks(member.Id);

        // Assert
        Assert.Equal(2, borrowedBooks.Count);
        Assert.Contains(book1, borrowedBooks);
        Assert.Contains(book2, borrowedBooks);
    }
}

