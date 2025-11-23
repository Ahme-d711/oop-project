namespace LibraryApp.Models;

/// <summary>
/// Student member class (inherits from Person)
/// </summary>
public class StudentMember : Person
{
    public string StudentId { get; set; }
    public int MaxBooksAllowed { get; set; } = 3; // Students can borrow up to 3 books

    public StudentMember(string name, string email, string studentId) 
        : base(name, email)
    {
        StudentId = studentId;
    }

    // Override virtual method from base class
    public override string ToString() => $"Student: {base.ToString()} (ID: {this.StudentId})";
}

