using LibraryApp.API.DTOs;
using LibraryApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BorrowController : ControllerBase
{
    private readonly LibraryService _libraryService;

    public BorrowController(LibraryService libraryService)
    {
        _libraryService = libraryService;
    }

    /// <summary>
    /// Borrow a book
    /// </summary>
    [HttpPost("borrow")]
    public ActionResult BorrowBook([FromBody] BorrowBookDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.BookId) || string.IsNullOrWhiteSpace(dto.MemberId))
        {
            return BadRequest(new { message = "Book ID and Member ID are required" });
        }

        try
        {
            bool success = _libraryService.BorrowBook(dto.BookId, dto.MemberId);
            if (success)
                return Ok(new { message = "Book borrowed successfully" });
            
            return BadRequest(new { message = "Failed to borrow book" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Return a book
    /// </summary>
    [HttpPost("return")]
    public ActionResult ReturnBook([FromBody] BorrowBookDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.BookId) || string.IsNullOrWhiteSpace(dto.MemberId))
        {
            return BadRequest(new { message = "Book ID and Member ID are required" });
        }

        try
        {
            bool success = _libraryService.ReturnBook(dto.BookId, dto.MemberId);
            if (success)
                return Ok(new { message = "Book returned successfully" });
            
            return BadRequest(new { message = "Failed to return book" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get borrowed books for a member
    /// </summary>
    [HttpGet("member/{memberId}")]
    public ActionResult<List<BookDto>> GetBorrowedBooks(string memberId)
    {
        try
        {
            var books = _libraryService.GetBorrowedBooks(memberId);
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
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

