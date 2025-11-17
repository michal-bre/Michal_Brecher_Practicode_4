using System.ComponentModel.DataAnnotations;

namespace TodoApi
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string UserName { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }
}
