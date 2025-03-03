using System;
using System.Collections.Concurrent;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        HttpListener listener = new HttpListener();
        listener.Prefixes.Add("http://+:8080/");
        listener.Start();
        Console.WriteLine("WebSocket server started on http://localhost:8080/");
        Console.WriteLine("Waiting for connections...");

        while (true)
        {
            try
            {
                // Get the next request
                HttpListenerContext context = await listener.GetContextAsync();
                
                if (context.Request.IsWebSocketRequest)
                {
                    ProcessWebSocketRequest(context);
                }
                else
                {
                    // Return simple HTML page for any HTTP request
                    string responseString = "<html><body><h1>Scoreboard WebSocket Server</h1><p>Connect using a WebSocket client</p></body></html>";
                    byte[] buffer = Encoding.UTF8.GetBytes(responseString);
                    context.Response.ContentLength64 = buffer.Length;
                    context.Response.OutputStream.Write(buffer, 0, buffer.Length);
                    context.Response.Close();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error handling request: {ex.Message}");
            }
        }
    }

    static async void ProcessWebSocketRequest(HttpListenerContext context)
    {
        WebSocketContext webSocketContext = null;
        try
        {
            webSocketContext = await context.AcceptWebSocketAsync(null);
            WebSocket webSocket = webSocketContext.WebSocket;
            
            Console.WriteLine($"Client connected: {webSocketContext.Origin}");
            
            await HandleWebSocketConnection(webSocket);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WebSocket error: {ex.Message}");
            
            // Close the response in case of error
            context.Response.StatusCode = 500;
            context.Response.Close();
        }
    }

    static async Task HandleWebSocketConnection(WebSocket webSocket)
    {
        try
        {
            // Send the resume command just once after connection
            await SendCommand(webSocket, JsonSerializer.Serialize(new { 
                type = "timer",
                action = "resume"
            }));
            
            // Keep the connection open
            while (webSocket.State == WebSocketState.Open)
            {
                await Task.Delay(1000);
            }
        }
        catch (WebSocketException ex)
        {
            Console.WriteLine($"WebSocket error: {ex.Message}");
        }
        finally
        {
            Console.WriteLine("Client disconnected");
            
            if (webSocket.State != WebSocketState.Closed)
            {
                try
                {
                    await webSocket.CloseAsync(
                        WebSocketCloseStatus.NormalClosure,
                        "Closing connection",
                        CancellationToken.None);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error closing WebSocket: {ex.Message}");
                }
            }
        }
    }

    static async Task SendCommand(WebSocket webSocket, string message)
    {
        byte[] messageBytes = Encoding.UTF8.GetBytes(message);
        var messageSegment = new ArraySegment<byte>(messageBytes);
        
        try
        {
            await webSocket.SendAsync(
                messageSegment,
                WebSocketMessageType.Text,
                true,
                CancellationToken.None
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending to client: {ex.Message}");
        }
    }
}