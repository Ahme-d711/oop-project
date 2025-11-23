namespace LibraryApp.Models;

/// <summary>
/// Interface for items that can be borrowed
/// </summary>
public interface IBorrowable
{
    bool IsAvailable { get; set; }
    string? BorrowedByMemberId { get; set; }
}

