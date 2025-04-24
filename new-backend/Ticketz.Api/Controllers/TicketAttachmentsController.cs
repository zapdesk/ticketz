using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ticketz.Core.Entities;
using Ticketz.Infrastructure.Data;

namespace Ticketz.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/tickets/{ticketId}/attachments")]
public class TicketAttachmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;

    public TicketAttachmentsController(
        ApplicationDbContext context,
        IWebHostEnvironment environment,
        IConfiguration configuration)
    {
        _context = context;
        _environment = environment;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TicketAttachment>>> GetAttachments(int ticketId)
    {
        return await _context.TicketAttachments
            .Include(a => a.CreatedBy)
            .Where(a => a.TicketId == ticketId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TicketAttachment>> GetAttachment(int ticketId, int id)
    {
        var attachment = await _context.TicketAttachments
            .Include(a => a.CreatedBy)
            .FirstOrDefaultAsync(a => a.Id == id && a.TicketId == ticketId);

        if (attachment == null)
        {
            return NotFound();
        }

        return attachment;
    }

    [HttpPost]
    public async Task<ActionResult<TicketAttachment>> UploadAttachment(int ticketId, IFormFile file)
    {
        if (!await TicketExists(ticketId))
        {
            return NotFound();
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest("No file was uploaded.");
        }

        var uploadsFolder = Path.Combine(_environment.ContentRootPath, "Uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var attachment = new TicketAttachment
        {
            TicketId = ticketId,
            FileName = file.FileName,
            ContentType = file.ContentType,
            FilePath = uniqueFileName,
            FileSize = file.Length,
            CreatedById = User.Identity?.Name ?? throw new InvalidOperationException("User not authenticated"),
            CreatedAt = DateTime.UtcNow
        };

        _context.TicketAttachments.Add(attachment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAttachment), new { ticketId, id = attachment.Id }, attachment);
    }

    [HttpGet("{id}/download")]
    public async Task<IActionResult> DownloadAttachment(int ticketId, int id)
    {
        var attachment = await _context.TicketAttachments
            .FirstOrDefaultAsync(a => a.Id == id && a.TicketId == ticketId);

        if (attachment == null)
        {
            return NotFound();
        }

        var filePath = Path.Combine(_environment.ContentRootPath, "Uploads", attachment.FilePath);
        if (!System.IO.File.Exists(filePath))
        {
            return NotFound("File not found on server.");
        }

        var memory = new MemoryStream();
        using (var stream = new FileStream(filePath, FileMode.Open))
        {
            await stream.CopyToAsync(memory);
        }
        memory.Position = 0;

        return File(memory, attachment.ContentType, attachment.FileName);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAttachment(int ticketId, int id)
    {
        var attachment = await _context.TicketAttachments
            .FirstOrDefaultAsync(a => a.Id == id && a.TicketId == ticketId);

        if (attachment == null)
        {
            return NotFound();
        }

        var filePath = Path.Combine(_environment.ContentRootPath, "Uploads", attachment.FilePath);
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }

        _context.TicketAttachments.Remove(attachment);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> TicketExists(int id)
    {
        return await _context.Tickets.AnyAsync(e => e.Id == id);
    }
} 