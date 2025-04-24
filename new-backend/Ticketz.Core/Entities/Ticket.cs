namespace Ticketz.Core.Entities;

public class Ticket
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TicketStatus Status { get; set; }
    public TicketPriority Priority { get; set; }
    public string? AssignedToId { get; set; }
    public User? AssignedTo { get; set; }
    public string CreatedById { get; set; } = string.Empty;
    public User CreatedBy { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public List<TicketComment> Comments { get; set; } = new();
    public List<TicketAttachment> Attachments { get; set; } = new();
}

public enum TicketStatus
{
    Open,
    InProgress,
    WaitingForCustomer,
    WaitingForThirdParty,
    Resolved,
    Closed
}

public enum TicketPriority
{
    Low,
    Medium,
    High,
    Critical
} 