using LibraryApp.Models;
using Xunit;

namespace Library.Tests;

/// <summary>
/// Unit tests for Person and derived classes (Inheritance)
/// </summary>
public class PersonTests
{
    [Fact]
    public void StudentMember_Constructor_ShouldCreateStudent()
    {
        // Arrange & Act
        var student = new StudentMember("Ahmed", "ahmed@test.com", "STU001");

        // Assert
        Assert.NotNull(student.Id);
        Assert.Equal("Ahmed", student.Name);
        Assert.Equal("ahmed@test.com", student.Email);
        Assert.Equal("STU001", student.StudentId);
        Assert.Equal(3, student.MaxBooksAllowed);
    }

    [Fact]
    public void TeacherMember_Constructor_ShouldCreateTeacher()
    {
        // Arrange & Act
        var teacher = new TeacherMember("Fatima", "fatima@test.com", "TCH001");

        // Assert
        Assert.NotNull(teacher.Id);
        Assert.Equal("Fatima", teacher.Name);
        Assert.Equal("fatima@test.com", teacher.Email);
        Assert.Equal("TCH001", teacher.EmployeeId);
        Assert.Equal(5, teacher.MaxBooksAllowed);
    }

    [Fact]
    public void StudentMember_ToString_ShouldIncludeStudentInfo()
    {
        // Arrange
        var student = new StudentMember("Ahmed", "ahmed@test.com", "STU001");

        // Act
        var result = student.ToString();

        // Assert
        Assert.Contains("Student", result);
        Assert.Contains("Ahmed", result);
        Assert.Contains("STU001", result);
    }

    [Fact]
    public void TeacherMember_ToString_ShouldIncludeTeacherInfo()
    {
        // Arrange
        var teacher = new TeacherMember("Fatima", "fatima@test.com", "TCH001");

        // Act
        var result = teacher.ToString();

        // Assert
        Assert.Contains("Teacher", result);
        Assert.Contains("Fatima", result);
        Assert.Contains("TCH001", result);
    }
}

