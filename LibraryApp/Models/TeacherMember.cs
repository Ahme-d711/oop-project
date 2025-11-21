namespace LibraryApp.Models;

/// <summary>
/// Teacher member class (inherits from Person)
/// </summary>
public class TeacherMember : Person
{
    public string EmployeeId { get; set; }
    public int MaxBooksAllowed { get; set; } = 5; // Teachers can borrow up to 5 books

    public TeacherMember(string name, string email, string employeeId) 
        : base(name, email)
    {
        EmployeeId = employeeId;
    }

    public override string ToString() => $"Teacher: {base.ToString()} (ID: {EmployeeId})";
}

