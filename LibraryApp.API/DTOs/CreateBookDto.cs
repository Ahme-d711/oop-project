namespace LibraryApp.API.DTOs;

/// <summary>
/// DTO for creating a new book
/// </summary>
public class CreateBookDto
{
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
}

