using System;
using System.Collections.Concurrent;
using System.IO.Ports;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    // Store the active WebSocket connection
    private static WebSocket _activeWebSocket;
    private static SerialPort _btLink;
    
    static async Task Main()
    {
        HttpListener listener = new HttpListener();
        listener.Prefixes.Add("http://+:8080/");
        listener.Start();
        Console.WriteLine("WebSocket server started on http://localhost:8080/");
        Console.WriteLine("Waiting for connections...");
        
        _btLink = new SerialPort("COM8", 9600);
        _btLink.Open();

        // Start keyboard input listener in a separate task
        Task keyboardTask = Task.Run(() => HandleKeyboardInput());
        Task bluetoothTask = Task.Run(() => HandleBluetoothInput());

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
        WebSocket webSocket = null;  // Move declaration outside of try block
        
        try
        {
            webSocketContext = await context.AcceptWebSocketAsync(null);
            webSocket = webSocketContext.WebSocket;  // Just assign here, don't redeclare
            
            // Store as the active WebSocket
            _activeWebSocket = webSocket;
            
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
        finally
        {
            // Clear the active WebSocket reference when done
            if (_activeWebSocket == webSocket)
                _activeWebSocket = null;
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
        if (webSocket == null || webSocket.State != WebSocketState.Open)
            return;
            
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
    
    // Handle keyboard input
    static async Task HandleKeyboardInput()
    {
        Console.WriteLine("Keyboard controls active. Press keys to send commands:");
        Console.WriteLine("  P = Pause timer");
        Console.WriteLine("  R = Resume timer");
        Console.WriteLine("  S = Stop timer");
        Console.WriteLine("  X = Reset timer");
        Console.WriteLine("  A = Advance set");
        Console.WriteLine("  D = Decrement set");
        Console.WriteLine("  1 = Add point to Team A");
        Console.WriteLine("  2 = Add point to Team B");
        Console.WriteLine("  F1 = Add foul to Team A");
        Console.WriteLine("  F2 = Add foul to Team B");
        
        while (true)
        {
            if (Console.KeyAvailable)
            {
                var key = Console.ReadKey(true);

                string command = key.Key switch
                {
                    ConsoleKey.P => JsonSerializer.Serialize(new { type = "timer", action = "pause" }),
                    ConsoleKey.R => JsonSerializer.Serialize(new { type = "timer", action = "resume" }),
                    ConsoleKey.S => JsonSerializer.Serialize(new { type = "timer", action = "stop" }),
                    ConsoleKey.X => JsonSerializer.Serialize(new { type = "timer", action = "reset" }),
                    ConsoleKey.OemPlus => JsonSerializer.Serialize(new { type = "timer", action = "addTime", value = 10 }),
                    ConsoleKey.A => JsonSerializer.Serialize(new { type = "sets", action = "advance" }),
                    ConsoleKey.D => JsonSerializer.Serialize(new { type = "sets", action = "decrement" }),
                    ConsoleKey.D1 => JsonSerializer.Serialize(new { type = "team", team = "A", action = "addPoints", value = 1 }),
                    ConsoleKey.D3 => JsonSerializer.Serialize(new { type = "team", team = "A", action = "subtractPoints", value = 1 }),
                    ConsoleKey.D2 => JsonSerializer.Serialize(new { type = "team", team = "B", action = "addPoints", value = 1 }),
                    ConsoleKey.D4 => JsonSerializer.Serialize(new { type = "team", team = "B", action = "subtractPoints", value = 1 }),
                    ConsoleKey.F1 => JsonSerializer.Serialize(new { type = "team", team = "A", action = "addFoul" }),
                    ConsoleKey.F3 => JsonSerializer.Serialize(new { type = "team", team = "A", action = "removeFoul" }),
                    ConsoleKey.F2 => JsonSerializer.Serialize(new { type = "team", team = "B", action = "addFoul" }),
                    ConsoleKey.F4 => JsonSerializer.Serialize(new { type = "team", team = "B", action = "removeFoul" }),
                    _ => null
                };
                
                if (command != null && _activeWebSocket != null)
                {
                    await SendCommand(_activeWebSocket, command);
                }
            }
            
            // Small delay to prevent high CPU usage
            await Task.Delay(50);
        }

    }

    static async Task HandleBluetoothInput()
    {
        while (true)
        {
            string key = _btLink.ReadLine().Trim();
            string command = key switch
            {
                "A" => JsonSerializer.Serialize(new { type = "timer", action = "pause" }),
                "B" => JsonSerializer.Serialize(new { type = "timer", action = "resume" }),
                "C" => JsonSerializer.Serialize(new { type = "timer", action = "stop" }),
                "D" => JsonSerializer.Serialize(new { type = "timer", action = "reset" }),
                "3" => JsonSerializer.Serialize(new { type = "sets", action = "advance" }),
                "6" => JsonSerializer.Serialize(new { type = "sets", action = "decrement" }),
                "1" => JsonSerializer.Serialize(new { type = "team", team = "A", action = "addPoints", value = 1 }),
                "4" => JsonSerializer.Serialize(new { type = "team", team = "A", action = "subtractPoints", value = 1 }),
                "2" => JsonSerializer.Serialize(new { type = "team", team = "B", action = "addPoints", value = 1 }),
                "5" => JsonSerializer.Serialize(new { type = "team", team = "B", action = "subtractPoints", value = 1 }),
                "7" => JsonSerializer.Serialize(new { type = "team", team = "A", action = "addFoul" }),
                "*" => JsonSerializer.Serialize(new { type = "team", team = "A", action = "removeFoul" }),
                "8" => JsonSerializer.Serialize(new { type = "team", team = "B", action = "addFoul" }),
                "0" => JsonSerializer.Serialize(new { type = "team", team = "B", action = "removeFoul" }),
                _ => null
            };
            
            if (command != null && _activeWebSocket != null)
            {
                await SendCommand(_activeWebSocket, command);
            }
        }
    }
}