namespace Ticketz.Core.Entities;

public class TicketComment
{
    public int Id { get; set; }
    public int TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public string CreatedById { get; set; } = string.Empty;
    public User CreatedBy { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsInternal { get; set; }
    public List<TicketAttachment> Attachments { get; set; } = new();
} 