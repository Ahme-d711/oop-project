namespace LibraryApp.Models;

/// <summary>
/// Sealed class - cannot be inherited (Final class equivalent)
/// </summary>
public sealed class Utility
{
    // Static class members
    public static string LibraryName { get; set; } = "Library Management System";
    
    // Static method
    public static string GetLibraryInfo()
    {
        return $"Welcome to {LibraryName}";
    }

    // Private constructor to prevent instantiation (static class pattern)
    private Utility() { }
}

