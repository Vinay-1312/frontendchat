using MongoDB.Driver;
using MongoDB.Bson;
public class addFriend {

    public string senderEmail {get; set; }

    
    public string recieverEmail {get; set; }

    public string status {get; set;}
     public addFriend(string senderEmail, string recieverEmail, string status)
    {
        // Use 'this' to distinguish between instance variable and parameter
        this.senderEmail = senderEmail;
        this.recieverEmail = recieverEmail;
        this.status = status;
        
    }
    public async Task addToDB()
    {
         string connectionString = "mongodb://localhost:27017";
                          
         Console.WriteLine("Here");
          MongoClient client = new MongoClient(connectionString);
        IMongoDatabase database = client.GetDatabase("ChatApplication");
        IMongoCollection<BsonDocument> collection = database.GetCollection<BsonDocument>("AddFriend");
           BsonDocument document = new BsonDocument
        {
            { "senderEmail", this.senderEmail },
            { "receiverEmail", this.recieverEmail },
            {"status",status}
            
            // Add other fields as needed
        };
        await collection.InsertOneAsync(document);
        
      
    
        // Close the connection (optional, as MongoClient manages connection pooling)
        
    }
     public async Task updateDB()
    {
         string connectionString = "mongodb://localhost:27017";
             //string connectionString = "mongodb+srv://vinaysld123:Chelsea%40123@clusterchat.vmrde2i.mongodb.net/";
         Console.WriteLine("Here");
          MongoClient client = new MongoClient(connectionString);
        IMongoDatabase database = client.GetDatabase("ChatApplication");
        IMongoCollection<BsonDocument> collection = database.GetCollection<BsonDocument>("AddFriend");
            var filter = Builders<BsonDocument>.Filter.Eq("senderEmail", this.senderEmail) &
                     Builders<BsonDocument>.Filter.Eq("receiverEmail", this.recieverEmail) &
                     Builders<BsonDocument>.Filter.Eq("status", "sent");

        // Specify the update operation
        var update = Builders<BsonDocument>.Update.Set("status", this.status);

        // Execute the update query
        var result = collection.UpdateOne(filter, update);
        if(this.status.Equals("Accepted"))
        {
             IMongoCollection<BsonDocument> collection1 = database.GetCollection<BsonDocument>("Chats");
           BsonDocument document = new BsonDocument
        {
            { "senderEmail", this.senderEmail },
            { "receiverEmail", this.recieverEmail },
            
            // Add other fields as needed
        };
             await collection1.InsertOneAsync(document);
        }
        
      
    
        // Close the connection (optional, as MongoClient manages connection pooling)
        
    }
      public async Task<List<string>> fetchFromDB()
    {
         string connectionString = "mongodb://localhost:27017";
         
         Console.WriteLine("Here");
          MongoClient client = new MongoClient(connectionString);
        IMongoDatabase database = client.GetDatabase("ChatApplication");
        IMongoCollection<BsonDocument> collection = database.GetCollection<BsonDocument>("AddFriend");
        var filter = Builders<BsonDocument>.Filter.And(
            Builders<BsonDocument>.Filter.Eq("receiverEmail", this.recieverEmail),
            Builders<BsonDocument>.Filter.Eq("status", this.status)
        );

        // Fetch documents based on the filter
        var documents = collection.Find(filter).ToList();

        // Process the fetched documents
       List<string> senderEmails = new List<string>();
        foreach (var document in documents)
        {
            var senderEmail = document.GetValue("senderEmail").AsString;
            if(!senderEmails.Contains(senderEmail))
            {
            senderEmails.Add(senderEmail);
            }
        }

        return senderEmails;
        // Close the connection (optional, as MongoClient manages connection pooling)
        
    }  public async Task<List<string>> fetchFriends()
    {
         string connectionString = "mongodb://localhost:27017";
             //string connectionString = "mongodb+srv://vinaysld123:Chelsea%40123@clusterchat.vmrde2i.mongodb.net/";
         Console.WriteLine("Here");
          MongoClient client = new MongoClient(connectionString);
        IMongoDatabase database = client.GetDatabase("ChatApplication");
        IMongoCollection<BsonDocument> collection = database.GetCollection<BsonDocument>("AddFriend");
        var filter = Builders<BsonDocument>.Filter.And(
            Builders<BsonDocument>.Filter.Eq("receiverEmail", this.recieverEmail),
            Builders<BsonDocument>.Filter.Eq("status", this.status)
        );

        // Fetch documents based on the filter
        var documents = collection.Find(filter).ToList();

        // Process the fetched documents
       List<string> senderEmails = new List<string>();
        foreach (var document in documents)
        {
            var senderEmail = document.GetValue("senderEmail").AsString;
            if(!senderEmails.Contains(senderEmail)  )
            {
            senderEmails.Add(senderEmail);
            }
        }
         var filter1 = Builders<BsonDocument>.Filter.And(
            Builders<BsonDocument>.Filter.Eq("senderEmail", this.recieverEmail),
            Builders<BsonDocument>.Filter.Eq("status", this.status)
        );

        // Fetch documents based on the filter
        var documents1 = collection.Find(filter1).ToList();

        // Process the fetched documents
       
        foreach (var document in documents1)
        {
            var senderEmail = document.GetValue("receiverEmail").AsString;
            if(!senderEmails.Contains(senderEmail) )
            {
                Console.WriteLine(senderEmail);
            senderEmails.Add(senderEmail);
            }
        }

        return senderEmails;
        // Close the connection (optional, as MongoClient manages connection pooling)
        
    }
    public async Task<string> fetchIDs(string senderEmail)
    {             //string connectionString = "mongodb+srv://vinaysld123:Chelsea%40123@clusterchat.vmrde2i.mongodb.net/";
      string connectionString = "mongodb://localhost:27017";
          MongoClient client = new MongoClient(connectionString);
        IMongoDatabase database = client.GetDatabase("ChatApplication");
        IMongoCollection<BsonDocument> collection = database.GetCollection<BsonDocument>("Chats");
        var filter = Builders<BsonDocument>.Filter.And(
            Builders<BsonDocument>.Filter.Eq("receiverEmail", this.recieverEmail),
            Builders<BsonDocument>.Filter.Eq("senderEmail", senderEmail)
        );

        // Fetch documents based on the filter
        var documents = collection.Find(filter).ToList();
       
        // Process the fetched documents
       List<string> senderEmails = new List<string>();
        foreach (var document in documents)
        {
            var chatID = document.GetValue("_id");
            Console.WriteLine("Converted chat id to string");
           return chatID.ToString();
        }
         var filter1 = Builders<BsonDocument>.Filter.And(
            Builders<BsonDocument>.Filter.Eq("senderEmail", this.recieverEmail),
            Builders<BsonDocument>.Filter.Eq("receiverEmail", senderEmail)
        );

        // Fetch documents based on the filter
        var documents1 = collection.Find(filter1).ToList();

        // Process the fetched documents
       
        foreach (var document in documents1)
        {
            var chatID = document.GetValue("_id");
            Console.WriteLine("Converted chat id to string");
           return chatID.ToString();
           
        }

        return null;
        // Close the connection (optional, as MongoClient manages connection pooling)
        
    }

   public   bool RecordExists()
    {
   // string connectionString = "mongodb://localhost:27017";
             string connectionString = "mongodb://localhost:27017";
    MongoClient client = new MongoClient(connectionString);
    IMongoDatabase database = client.GetDatabase("ChatApplication");
    IMongoCollection<BsonDocument> collection = database.GetCollection<BsonDocument>("AddFriend");

    // Define the filter based on the criteria
    var filter = Builders<BsonDocument>.Filter.And(
        Builders<BsonDocument>.Filter.Eq("senderEmail", this.senderEmail),
        Builders<BsonDocument>.Filter.Eq("receiverEmail", this.recieverEmail)
    );

    // Check if any documents match the filter criteria
    return collection.Find(filter).Any();
}
 public  async Task  insertChat(string id,string content,string sender, string timestamp)
    {
     //string connectionString = "mongodb://localhost:27017";
                  string connectionString = "mongodb+srv://vinaysld123:Chelsea%40123@clusterchat.vmrde2i.mongodb.net/";
         Console.WriteLine("Here");
          MongoClient client = new MongoClient(connectionString);
        IMongoDatabase database = client.GetDatabase("ChatApplication");
        IMongoCollection<BsonDocument> collection = database.GetCollection<BsonDocument>("Messages");
           BsonDocument document = new BsonDocument
        {
            { "chatid", id },
            { "content", content },
            {"sender",sender},
            {"timestamp",timestamp}
            
            // Add other fields as needed
        };
        await collection.InsertOneAsync(document);
}

public async Task<List<BsonDocument>>  fetchChats(string id)

{
  //string connectionString = "mongodb://localhost:27017";
             string connectionString = "mongodb://localhost:27017";
         Console.WriteLine("Here5");
          MongoClient client = new MongoClient(connectionString);
        IMongoDatabase database = client.GetDatabase("ChatApplication");
        IMongoCollection<BsonDocument> collection = database.GetCollection<BsonDocument>("Messages");
     var filter =  Builders<BsonDocument>.Filter.Eq("chatid", id);
      try
        {
            // Fetch the records based on the provided filter
            var records = await collection.Find(filter).ToListAsync();
            Console.WriteLine(records);
            return records;
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
            return null;
        }
    
   
}

    
}