using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ticketz.Core.Entities;
using Ticketz.Infrastructure.Data;

namespace Ticketz.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/tickets/{ticketId}/comments")]
public class TicketCommentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TicketCommentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TicketComment>>> GetComments(int ticketId)
    {
        return await _context.TicketComments
            .Include(c => c.CreatedBy)
            .Include(c => c.Attachments)
            .Where(c => c.TicketId == ticketId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TicketComment>> GetComment(int ticketId, int id)
    {
        var comment = await _context.TicketComments
            .Include(c => c.CreatedBy)
            .Include(c => c.Attachments)
            .FirstOrDefaultAsync(c => c.Id == id && c.TicketId == ticketId);

        if (comment == null)
        {
            return NotFound();
        }

        return comment;
    }

    [HttpPost]
    public async Task<ActionResult<TicketComment>> CreateComment(int ticketId, TicketComment comment)
    {
        if (!await TicketExists(ticketId))
        {
            return NotFound();
        }

        comment.TicketId = ticketId;
        comment.CreatedById = User.Identity?.Name ?? throw new InvalidOperationException("User not authenticated");
        comment.CreatedAt = DateTime.UtcNow;

        _context.TicketComments.Add(comment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetComment), new { ticketId, id = comment.Id }, comment);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateComment(int ticketId, int id, TicketComment comment)
    {
        if (id != comment.Id || ticketId != comment.TicketId)
        {
            return BadRequest();
        }

        var existingComment = await _context.TicketComments.FindAsync(id);
        if (existingComment == null)
        {
            return NotFound();
        }

        existingComment.Content = comment.Content;
        existingComment.IsInternal = comment.IsInternal;
        existingComment.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await CommentExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int ticketId, int id)
    {
        var comment = await _context.TicketComments
            .FirstOrDefaultAsync(c => c.Id == id && c.TicketId == ticketId);

        if (comment == null)
        {
            return NotFound();
        }

        _context.TicketComments.Remove(comment);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> TicketExists(int id)
    {
        return await _context.Tickets.AnyAsync(e => e.Id == id);
    }

    private async Task<bool> CommentExists(int id)
    {
        return await _context.TicketComments.AnyAsync(e => e.Id == id);
    }
} 