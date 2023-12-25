    // FriendRequestHub.cs
    using Microsoft.AspNetCore.SignalR;
    using System.Threading.Tasks;

    public class MessageProperty
    {
        public string Name { get; set; }
        public object Value { get; set; }
    }

    public class FriendRequestHub : Hub
    {
        private static Dictionary<string, string> userConnections = new Dictionary<string, string>();

    public async Task JoinUserGroup(string userId)
        {
            userConnections[userId] = Context.ConnectionId;
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            Console.WriteLine($"User {userId} joined the group. ConnectionId: {Context.ConnectionId}");
        }

        /*
        public async Task SendFriendRequest(string senderId, string receiverId)
        {
            if (userConnections.TryGetValue(receiverId, out string receiverConnectionId))
            {   
                await Clients.Client(receiverConnectionId).SendAsync("ReceiveFriendRequest", senderId);
        
                foreach (var clientId in userConnections.Keys.ToList())
            {
                Console.WriteLine(clientId);
            }
                Console.WriteLine(receiverConnectionId);
                Console.WriteLine($"Friend request sent from {senderId} to {receiverId}.");
            }
            else
            {
                Console.WriteLine($"Receiver {receiverId} not found or offline.");
            }

        }*/
        public async Task SendFriendRequest(string senderId, string receiverId)
        {
            // Handle friend request logic, store in a database, etc.
            
            // Notify the receiver about the friend request
        
            await Clients.Client(userConnections[receiverId]).SendAsync("ReceiveFriendRequest", senderId);
        }
        public async Task sendFriends(string senderId, string receiverId)
        {
            // Handle friend request logic, store in a database, etc.
            
            // Notify the receiver about the friend request
        
            await Clients.Client(userConnections[receiverId]).SendAsync("ReceiveFriends", senderId);
        }
        public async Task SendMessage(string receiverId, List<MessageProperty> message)
        {
           var formattedMessage = message.Select(msg => new MessageProperty
    {
        Name = msg.Name, // Preserve the original case
        Value = msg.Value
    }).ToList();
            await Clients.Client(userConnections[receiverId]).SendAsync("ReceiveMessage", formattedMessage);
        }
    }