using Microsoft.EntityFrameworkCore;
using TodoApi;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ✅ CORS – מדיניות בשם מפורש
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy
            .WithOrigins("https://todolistmichal.onrender.com")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes("SUPER_ULTRA_SECRET_KEY_1234567890!!"))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("ToDoDB"),
        new MySqlServerVersion(new Version(8, 0, 44))));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ❗ סדר מדויק – הכי קריטי
app.UseCors("AllowClient");   // ← חייב להיות ראשון
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ----------------------
//      API ENDPOINTS
// ----------------------

app.MapGet("/api/items", async (ToDoDbContext db, HttpContext ctx) =>
{
    var userName = ctx.User.Identity?.Name;
    var user = db.Users.FirstOrDefault(u => u.UserName == userName);

    if (user == null)
        return Results.Unauthorized();

    var items = db.Items.Where(i => i.UserId == user.Id).ToList();
    return Results.Ok(items);
})
.RequireAuthorization();

app.MapPost("/api/items", async (ToDoDbContext db, Item newItem, HttpContext ctx) =>
{
    var userName = ctx.User.Identity?.Name;
    var user = db.Users.FirstOrDefault(u => u.UserName == userName);

    if (user == null)
        return Results.Unauthorized();

    newItem.UserId = user.Id;
    db.Items.Add(newItem);
    await db.SaveChangesAsync();

    return Results.Created($"/api/items/{newItem.Id}", newItem);
})
.RequireAuthorization();

app.MapPut("/api/items/{id}", async (ToDoDbContext db, int id, Item updatedItem) =>
{
    var existing = await db.Items.FindAsync(id);
    if (existing == null)
        return Results.NotFound();

    existing.Name = updatedItem.Name;
    existing.IsComplete = updatedItem.IsComplete;
    await db.SaveChangesAsync();
    return Results.Ok(existing);
})
.RequireAuthorization();

app.MapDelete("/api/items/{id}", async (ToDoDbContext db, int id) =>
{
    var item = await db.Items.FindAsync(id);
    if (item == null)
        return Results.NotFound();

    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.RequireAuthorization();

// ----------------------
//   AUTH – NO AUTH HERE
// ----------------------

app.MapPost("/api/register", async (ToDoDbContext db, User user) =>
{
    if (db.Users.Any(u => u.UserName == user.UserName))
        return Results.BadRequest("User already exists");

    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Ok("Registered");
})
.AllowAnonymous();

app.MapPost("/api/login", async (ToDoDbContext db, User login) =>
{
    var user = db.Users.FirstOrDefault(u =>
        u.UserName == login.UserName && u.Password == login.Password);

    if (user == null)
        return Results.Unauthorized();

    var claims = new[] { new Claim(ClaimTypes.Name, user.UserName) };

    var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("SUPER_ULTRA_SECRET_KEY_1234567890!!"));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.Now.AddHours(1),
        signingCredentials: creds);

    return Results.Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
})
.AllowAnonymous();

app.Run();
