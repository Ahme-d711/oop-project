using LibraryApp.API.DTOs;
using LibraryApp.Models;
using LibraryApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembersController : ControllerBase
{
    private readonly LibraryService _libraryService;

    public MembersController(LibraryService libraryService)
    {
        _libraryService = libraryService;
    }

    /// <summary>
    /// Get all members
    /// </summary>
    [HttpGet]
    public ActionResult<List<MemberDto>> GetAllMembers()
    {
        var members = _libraryService.GetAllMembers();
        var memberDtos = members.Select(m => new MemberDto
        {
            Id = m.Id,
            Name = m.Name,
            Email = m.Email,
            MemberType = m is StudentMember ? "student" : "teacher",
            IdNumber = m is StudentMember student ? student.StudentId : 
                      m is TeacherMember teacher ? teacher.EmployeeId : ""
        }).ToList();

        return Ok(memberDtos);
    }

    /// <summary>
    /// Get a member by ID
    /// </summary>
    [HttpGet("{id}")]
    public ActionResult<MemberDto> GetMember(string id)
    {
        var members = _libraryService.GetAllMembers();
        var member = members.FirstOrDefault(m => m.Id == id);

        if (member == null)
            return NotFound(new { message = "Member not found" });

        var memberDto = new MemberDto
        {
            Id = member.Id,
            Name = member.Name,
            Email = member.Email,
            MemberType = member is StudentMember ? "student" : "teacher",
            IdNumber = member is StudentMember student ? student.StudentId : 
                      member is TeacherMember teacher ? teacher.EmployeeId : ""
        };

        return Ok(memberDto);
    }

    /// <summary>
    /// Register a new member
    /// </summary>
    [HttpPost]
    public ActionResult<MemberDto> RegisterMember([FromBody] CreateMemberDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.MemberType) || string.IsNullOrWhiteSpace(dto.IdNumber))
        {
            return BadRequest(new { message = "All fields are required" });
        }

        try
        {
            string memberId = _libraryService.RegisterMember(dto.Name, dto.Email, dto.MemberType, dto.IdNumber);
            var member = _libraryService.GetAllMembers().FirstOrDefault(m => m.Id == memberId);

            if (member == null)
                return StatusCode(500, new { message = "Failed to register member" });

            var memberDto = new MemberDto
            {
                Id = member.Id,
                Name = member.Name,
                Email = member.Email,
                MemberType = member is StudentMember ? "student" : "teacher",
                IdNumber = member is StudentMember student ? student.StudentId : 
                          member is TeacherMember teacher ? teacher.EmployeeId : ""
            };

            return CreatedAtAction(nameof(GetMember), new { id = memberId }, memberDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

