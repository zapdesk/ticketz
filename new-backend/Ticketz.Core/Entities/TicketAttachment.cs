namespace Ticketz.Core.Entities;

public class TicketAttachment
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string CreatedById { get; set; } = string.Empty;
    public User CreatedBy { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    
    // Navigation properties
    public int? TicketId { get; set; }
    public Ticket? Ticket { get; set; }
    public int? CommentId { get; set; }
    public TicketComment? Comment { get; set; }
} 