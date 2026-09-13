using System.Text.Json.Serialization;

namespace BirthdayBackend.DTOs;

public sealed class CreateWishRequest
{
    public string? FriendName { get; init; }

    public string? WishMessage { get; init; }

    [JsonIgnore]
    public string NormalizedFriendName => NormalizeSingleLine(FriendName);

    [JsonIgnore]
    public string NormalizedWishMessage => NormalizeMultiLine(WishMessage);

    private static string NormalizeSingleLine(string? value)
    {
        return string.Join(' ', (value ?? string.Empty)
            .Trim()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries));
    }

    private static string NormalizeMultiLine(string? value)
    {
        var lines = (value ?? string.Empty)
            .Trim()
            .Split('\n', StringSplitOptions.RemoveEmptyEntries)
            .Select(line => string.Join(' ', line.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries)));

        return string.Join('\n', lines);
    }
}
