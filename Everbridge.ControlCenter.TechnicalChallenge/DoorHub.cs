using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Everbridge.ControlCenter.TechnicalChallenge.Hubs
{
    public class DoorHub : Hub
    {
        // Define SignalR hub methods for broadcasting door updates
        public async Task SendDoorStatus(string doorId, bool isOpen, bool isLocked)
        {
            await Clients.All.SendAsync("DoorStatusUpdated", doorId, isOpen, isLocked);
        }
    }
}
