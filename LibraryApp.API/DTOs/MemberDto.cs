namespace LibraryApp.API.DTOs;

/// <summary>
/// Data Transfer Object for Member
/// </summary>
public class MemberDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MemberType { get; set; } = string.Empty; // "student" or "teacher"
    public string IdNumber { get; set; } = string.Empty; // StudentId or EmployeeId
}

