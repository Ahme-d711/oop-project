namespace LibraryApp.API.DTOs;

/// <summary>
/// DTO for borrowing a book
/// </summary>
public class BorrowBookDto
{
    public string BookId { get; set; } = string.Empty;
    public string MemberId { get; set; } = string.Empty;
}

