namespace LibraryApp.API.DTOs;

/// <summary>
/// Data Transfer Object for Book
/// </summary>
public class BookDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
    public string? BorrowedByMemberId { get; set; }
}

