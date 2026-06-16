namespace HotelManagement.Server.Utilities
{
    public static class FileValidation
    {
        public static readonly string[] AllowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
        public const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

        public static bool IsValidImage(IFormFile file)
        {
            if (file.Length == 0 || file.Length > MaxFileSizeBytes)
                return false;

            return AllowedImageTypes.Contains(file.ContentType.ToLowerInvariant());
        }
    }
}
