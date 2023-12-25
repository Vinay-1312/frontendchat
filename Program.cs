using Microsoft.AspNetCore.Cors;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.WithOrigins("http://localhost:3000")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials());
});

builder.Services.AddSignalR();


var app = builder.Build();

     app.UseCors("AllowOrigin"); 

app.UseRouting();
// Configure the HTTP request pipeline.
app.UseCors("CorsPolicy");
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapPost("/addFriend", async context =>
{
     try{
     using var reader = new StreamReader(context.Request.Body);
     
     var requestBody = await reader.ReadToEndAsync();
      JsonDocument jsonDocument = JsonDocument.Parse(requestBody);

        // Access values using the root element
        JsonElement root = jsonDocument.RootElement;

        // Access individual properties
        string senderEmail = root.GetProperty("senderEmail").GetString();
        string receiverEmail = root.GetProperty("receiverEmail").GetString();
        string status = root.GetProperty("status").GetString();
    addFriend friend = new addFriend(senderEmail,receiverEmail,status);
    Console.WriteLine(status);
    var friendExist =  friend.RecordExists();
    if (status.Equals("Accepted") || status.Equals("Rejected") )
    {
        friend.updateDB();
    }
     else if( !friendExist)
     {
   await  friend.addToDB();
     }
    
    var jsonResponse = new
                {
                    Status = "Success",
                    Message = friendExist ?"Friend Already Exist" : "Friend request Sent."
                };

                // Set the content type to JSON
                context.Response.ContentType = "application/json";
                 context.Response.StatusCode =friendExist ? 200 : 201; 
                      var hubContext = context.RequestServices.GetRequiredService<IHubContext<FriendRequestHub>>();
                // Serialize the JSON response and write it to the response body
                 await hubContext.Clients.User(receiverEmail).SendAsync("ReceiveFriendRequest", senderEmail);
                 
                await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(jsonResponse));
     }
     catch(Exception ex)
     {
       var jsonResponse = new
        {
            Status = "Error",
            Message = $"Internal Server Error: {ex.Message}"
        };

        // Set the content type to JSON
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = 500;

        // Serialize the JSON response and write it to the response body
        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(jsonResponse));
     }
})
.WithName("PostAddFriend")
.WithOpenApi();

app.MapPost("/friendRequests", async context =>
{
     try{
        Console.WriteLine("Here2");
     using var reader = new StreamReader(context.Request.Body);
     
     var requestBody = await reader.ReadToEndAsync();
      JsonDocument jsonDocument = JsonDocument.Parse(requestBody);

        // Access values using the root element
        JsonElement root = jsonDocument.RootElement;

        // Access individual properties
      
    string receiverEmail = root.GetProperty("receiverEmail").GetString();
 
     addFriend friend = new addFriend("",receiverEmail,"sent");
   var friendRequests=  friend.fetchFromDB();
   var jsonResponse = new
                {
                    Status = "Success",
                    Message = friendRequests
                };

                // Set the content type to JSON
                context.Response.ContentType = "application/json";
                 context.Response.StatusCode =200;
                // Serialize the JSON response and write it to the response body
                await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(jsonResponse));
    
     }
     catch(Exception ex)
     {
        Console.WriteLine(ex.Message);
       var jsonResponse = new
        {
            Status = "Error",
            Message = $"Internal Server Error: {ex.Message}"
        };

        // Set the content type to JSON
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = 500;

        // Serialize the JSON response and write it to the response body
        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(jsonResponse));
     }
})
.WithName("GetFriendRequests")
.WithOpenApi();

app.MapPost("/friends", async context =>
{
     try{
        Console.WriteLine("Here2");
     using var reader = new StreamReader(context.Request.Body);
     
     var requestBody = await reader.ReadToEndAsync();
      JsonDocument jsonDocument = JsonDocument.Parse(requestBody);

        // Access values using the root element
        JsonElement root = jsonDocument.RootElement;

        // Access individual properties
      
    string receiverEmail = root.GetProperty("receiverEmail").GetString();
 
     addFriend friend = new addFriend("",receiverEmail,"Accepted");
   var friendRequests=  friend.fetchFriends();

   var jsonResponse = new
                {
                    Status = "Success",
                    Message = friendRequests
                };

                // Set the content type to JSON
                context.Response.ContentType = "application/json";
                 context.Response.StatusCode =200;
                // Serialize the JSON response and write it to the response body
                await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(jsonResponse));
    
     }
     catch(Exception ex)
     {
        Console.WriteLine(ex.Message);
       var jsonResponse = new
        {
            Status = "Error",
            Message = $"Internal Server Error: {ex.Message}"
        };

        // Set the content type to JSON
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = 500;

        // Serialize the JSON response and write it to the response body
        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(jsonResponse));
     }
})
.WithName("GetFriend")
.WithOpenApi();
app.MapPost("/ids", async context =>
{
     try{
  
     using var reader = new StreamReader(context.Request.Body);
     
     var requestBody = await reader.ReadToEndAsync();
      JsonDocument jsonDocument = JsonDocument.Parse(requestBody);

        // Access values using the root element
        JsonElement root = jsonDocument.RootElement;

        // Access individual properties
      
    string receiverEmail = root.GetProperty("receiverEmail").GetString();
    List<String> chatIDS = new List<string>();
    if (root.TryGetProperty("senderEmail", out var senderEmails))
    {
 if (senderEmails.ValueKind == JsonValueKind.Array)
    {
        // Extract the values as a list of integers
        List<string> senderList = senderEmails.EnumerateArray().Select(x => x.GetString()).ToList();

        // Your processing logic here...
        addFriend friend = new addFriend("",receiverEmail,"Accepted");
        // For example, print the values in the list
        Console.WriteLine("Received List:");
        foreach (var item in senderList)
        {
              Task<string> chatIDTask=  friend.fetchIDs(item);
              string chatid = await chatIDTask;
              chatIDS.Add(chatid);
        }
    }

    }
     
 

   var jsonResponse = new
                {
                    Status = "Success",
                    Message = chatIDS
                };

                // Set the content type to JSON
                context.Response.ContentType = "application/json";
                 context.Response.StatusCode =200;
                // Serialize the JSON response and write it to the response body
                await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(jsonResponse));
    
     }
     catch(Exception ex)
     {
        Console.WriteLine(ex.Message);
       var jsonResponse = new
        {
            Status = "Error",
            Message = $"Internal Server Error: {ex.Message}"
        };

        // Set the content type to JSON
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = 500;

        // Serialize the JSON response and write it to the response body
        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(jsonResponse));
     }
})
.WithName("GEtID")
.WithOpenApi();
app.MapPost("/insertChat", async context =>
{
     try{
        Console.WriteLine("Here2");
     using var reader = new StreamReader(context.Request.Body);
     
     var requestBody = await reader.ReadToEndAsync();
      JsonDocument jsonDocument = JsonDocument.Parse(requestBody);

        // Access values using the root element
        JsonElement root = jsonDocument.RootElement;

        // Access individual properties
      
    string id = root.GetProperty("id").GetString();
    string content = root.GetProperty("content").GetString();
    string sender = root.GetProperty("sender").GetString();
    string timestamp = root.GetProperty("timestamp").GetString();


 
     addFriend friend = new addFriend("","","");
  
    var chatExists =  friend.insertChat(id,content,sender,timestamp);
   var jsonResponse = new
                {
                    Status = "Success",
                    Message = "Inserted Succesfully"
                };

                // Set the content type to JSON
                context.Response.ContentType = "application/json";
                 context.Response.StatusCode =200;
                // Serialize the JSON response and write it to the response body
                await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(jsonResponse));
    
     }
     catch(Exception ex)
     {
        Console.WriteLine(ex.Message);
       var jsonResponse = new
        {
            Status = "Error",
            Message = $"Internal Server Error: {ex.Message}"
        };

        // Set the content type to JSON
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = 500;

        // Serialize the JSON response and write it to the response body
        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(jsonResponse));
     }
})
.WithName("PostInsertChat")
.WithOpenApi();
app.MapPost("/fetchChat", async context =>
{
     try{
        Console.WriteLine("Here2");
     using var reader = new StreamReader(context.Request.Body);
     
     var requestBody = await reader.ReadToEndAsync();
      JsonDocument jsonDocument = JsonDocument.Parse(requestBody);

        // Access values using the root element
        JsonElement root = jsonDocument.RootElement;

        // Access individual properties
      
    string id = root.GetProperty("id").GetString();
   



 Console.WriteLine("Inside Chat");
     addFriend friend = new addFriend("","","");
  
    var records =  await friend.fetchChats(id);
    Console.WriteLine(records);
    foreach (var record in records)
{
    Console.WriteLine(record);
}
   var jsonResponse = new
                {
                    Status = "Success",
                    Message = records
                };

                // Set the content type to JSON
                context.Response.ContentType = "application/json";
                 context.Response.StatusCode =200;
                 
                // Serialize the JSON response and write it to the response body
                await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject(jsonResponse));
    
     }
     catch(Exception ex)
     {
        Console.WriteLine(ex.Message);
       var jsonResponse = new
        {
            Status = "Error",
            Message = $"Internal Server Error: {ex.Message}"
        };

        // Set the content type to JSON
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = 500;

        // Serialize the JSON response and write it to the response body
        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(jsonResponse));
     }
})
.WithName("GetChat")
.WithOpenApi();


app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<FriendRequestHub>("/friendRequestHub");
});
app.Run();

