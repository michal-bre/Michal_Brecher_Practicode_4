using System;
using System.Collections.Generic;

namespace TodoApi;

using System.ComponentModel.DataAnnotations;
public partial class Item
{
    [Key] 
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool IsComplete { get; set; } = false;
    public int UserId { get; set; } 
}

