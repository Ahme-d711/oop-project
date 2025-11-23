using LibraryApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS to allow Next.js frontend to connect
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Register LibraryService as Singleton
builder.Services.AddSingleton<LibraryService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowNextJS");

app.UseAuthorization();

app.MapControllers();

// Initialize sample data
var libraryService = app.Services.GetRequiredService<LibraryService>();
InitializeSampleData(libraryService);

app.Run();

static void InitializeSampleData(LibraryService service)
{
    // Add sample books
    service.AddBook("Clean Code", "Robert C. Martin");
    service.AddBook("Design Patterns", "Gang of Four");
    service.AddBook("The Pragmatic Programmer", "Andrew Hunt");

    // Add sample members
    service.RegisterMember("Ahmed Mohamed", "ahmed@example.com", "student", "STU001");
    service.RegisterMember("Fatima Ali", "fatima@example.com", "teacher", "TCH001");
}
