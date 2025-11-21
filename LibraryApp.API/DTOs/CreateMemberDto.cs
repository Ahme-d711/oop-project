namespace LibraryApp.API.DTOs;

/// <summary>
/// DTO for creating a new member
/// </summary>
public class CreateMemberDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MemberType { get; set; } = string.Empty; // "student" or "teacher"
    public string IdNumber { get; set; } = string.Empty;
}

