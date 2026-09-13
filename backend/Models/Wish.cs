namespace BirthdayBackend.Models;

public sealed class Wish
{
    public int Id { get; set; }

    public string FriendName { get; set; } = string.Empty;

    public string WishMessage { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
