using LibraryApp.Models;
using Xunit;

namespace Library.Tests;

/// <summary>
/// Unit tests for Book class
/// </summary>
public class BookTests
{
    [Fact]
    public void Book_Constructor_ShouldCreateBookWithProperties()
    {
        // Arrange & Act
        var book = new Book("Test Book", "Test Author");

        // Assert
        Assert.NotNull(book.Id);
        Assert.Equal("Test Book", book.Title);
        Assert.Equal("Test Author", book.Author);
        Assert.True(book.IsAvailable);
        Assert.Null(book.BorrowedByMemberId);
    }

    [Fact]
    public void Book_ToString_ShouldReturnFormattedString()
    {
        // Arrange
        var book = new Book("Clean Code", "Robert Martin");

        // Act
        var result = book.ToString();

        // Assert
        Assert.Contains("Clean Code", result);
        Assert.Contains("Robert Martin", result);
        Assert.Contains("[متاح]", result);
    }

    [Fact]
    public void Book_WhenBorrowed_ShouldShowBorrowedStatus()
    {
        // Arrange
        var book = new Book("Test Book", "Test Author");
        book.IsAvailable = false;
        book.BorrowedByMemberId = "member123";

        // Act
        var result = book.ToString();

        // Assert
        Assert.Contains("[معار]", result);
    }
}

