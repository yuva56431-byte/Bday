namespace BirthdayBackend.DTOs;

public sealed record WishResponse(
    int Id,
    string FriendName,
    string WishMessage,
    DateTime CreatedAt);
