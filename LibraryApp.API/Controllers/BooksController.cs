using LibraryApp.API.DTOs;
using LibraryApp.Models;
using LibraryApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly LibraryService _libraryService;

    public BooksController(LibraryService libraryService)
    {
        _libraryService = libraryService;
    }

    /// <summary>
    /// Get all books
    /// </summary>
    [HttpGet]
    public ActionResult<List<BookDto>> GetAllBooks()
    {
        var books = _libraryService.GetAllBooks();
        var bookDtos = books.Select(b => new BookDto
        {
            Id = b.Id,
            Title = b.Title,
            Author = b.Author,
            IsAvailable = b.IsAvailable,
            BorrowedByMemberId = b.BorrowedByMemberId
        }).ToList();

        return Ok(bookDtos);
    }

    /// <summary>
    /// Get a book by ID
    /// </summary>
    [HttpGet("{id}")]
    public ActionResult<BookDto> GetBook(string id)
    {
        var books = _libraryService.GetAllBooks();
        var book = books.FirstOrDefault(b => b.Id == id);

        if (book == null)
            return NotFound(new { message = "Book not found" });

        var bookDto = new BookDto
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            IsAvailable = book.IsAvailable,
            BorrowedByMemberId = book.BorrowedByMemberId
        };

        return Ok(bookDto);
    }

    /// <summary>
    /// Create a new book
    /// </summary>
    [HttpPost]
    public ActionResult<BookDto> CreateBook([FromBody] CreateBookDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Author))
        {
            return BadRequest(new { message = "Title and author are required" });
        }

        try
        {
            string bookId = _libraryService.AddBook(dto.Title, dto.Author);
            var book = _libraryService.GetAllBooks().FirstOrDefault(b => b.Id == bookId);

            if (book == null)
                return StatusCode(500, new { message = "Failed to create book" });

            var bookDto = new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                IsAvailable = book.IsAvailable,
                BorrowedByMemberId = book.BorrowedByMemberId
            };

            return CreatedAtAction(nameof(GetBook), new { id = bookId }, bookDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete a book
    /// </summary>
    [HttpDelete("{id}")]
    public ActionResult DeleteBook(string id)
    {
        try
        {
            bool success = _libraryService.RemoveBook(id);
            if (!success)
                return NotFound(new { message = "Book not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Search books by title or author
    /// </summary>
    [HttpGet("search")]
    public ActionResult<List<BookDto>> SearchBooks([FromQuery] string? term)
    {
        var books = _libraryService.SearchBooks(term ?? "");
        var bookDtos = books.Select(b => new BookDto
        {
            Id = b.Id,
            Title = b.Title,
            Author = b.Author,
            IsAvailable = b.IsAvailable,
            BorrowedByMemberId = b.BorrowedByMemberId
        }).ToList();

        return Ok(bookDtos);
    }
}

