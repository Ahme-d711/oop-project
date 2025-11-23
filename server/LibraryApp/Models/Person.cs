namespace LibraryApp.Models;

/// <summary>
/// Base class for all library members (Inheritance)
/// </summary>
public abstract class Person
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }

    protected Person(string name, string email)
    {
        Id = Guid.NewGuid().ToString();
        Name = name;
        Email = email;
    }

    // Virtual method for polymorphism (overriding object.ToString())
    public override string ToString() => $"{Name} ({Email})";
}

