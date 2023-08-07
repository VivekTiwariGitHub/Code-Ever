using Everbridge.ControlCenter.TechnicalChallenge.DoorDatabase;
using Everbridge.ControlCenter.TechnicalChallenge.Hubs;
using Everbridge.ControlCenter.TechnicalChallenge.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class DoorController : ControllerBase
{
    private readonly ILogger<DoorController> _logger;
    private readonly DoorRepositoryService _doorRepositoryService;
    private readonly IHubContext<DoorHub> _doorHubContext; // Inject SignalR hub context

    public DoorController(ILogger<DoorController> logger, DoorRepositoryDatabaseContext databaseContext, IHubContext<DoorHub> doorHubContext)
    {
        _logger = logger;
        _doorRepositoryService = new DoorRepositoryService(databaseContext);
        _doorHubContext = doorHubContext;
    }

    [HttpGet]
    public async Task<IEnumerable<DoorModel>> Get()
    {
        try
        {
            var doors = await _doorRepositoryService.GetDoors();
            return doors.Select(x => new DoorModel()
            {
                Id = x.Id,
                Label = x.Label,
                IsLocked = x.IsLocked,
                IsOpen = x.IsOpen
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetching doors");
            throw;
        }
    }

    [HttpGet]
    [Route("{doorId}")]
    public async Task<ActionResult<DoorModel>> GetDoor([FromRoute][Required] string doorId)
    {
        try
        {
            var doorRecord = await _doorRepositoryService.GetDoor(doorId);
            if (doorRecord == null)
            {
                return NotFound();
            }

            return new DoorModel
            {
                Id = doorRecord.Id,
                Label = doorRecord.Label,
                IsOpen = doorRecord.IsOpen,
                IsLocked = doorRecord.IsLocked
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetching door with ID: {DoorId}", doorId);
            throw;
        }
    }

    [HttpPost]
    public async Task<ActionResult<DoorModel>> AddDoor(DoorModel door)
    {
        try
        {
            var doorRecordDto = new DoorRecordDto
            {
                Label = door.Label,
                IsLocked = door.IsLocked,
                IsOpen = door.IsOpen
            };
            var addedDoor = await _doorRepositoryService.AddDoor(doorRecordDto);
            return new DoorModel
            {
                Id = addedDoor.Id,
                Label = addedDoor.Label,
                IsOpen = addedDoor.IsOpen,
                IsLocked = addedDoor.IsLocked
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while adding a new door");
            throw;
        }
    }

    [HttpPut("{doorId}")]
    public async Task<ActionResult<DoorModel>> UpdateDoor([FromRoute][Required] string doorId, UpdateDoorModel updatedDoor)
    {
        try
        {
            var existingDoor = new DoorRecordDto
            {
                Id = updatedDoor.Id,
                Label = updatedDoor.Label,
                IsOpen = updatedDoor.IsOpen,
                IsLocked = updatedDoor.IsLocked
            };

            var updatedDoorRecord = await _doorRepositoryService.UpdateDoor(existingDoor);

            if (updatedDoorRecord == null)
            {
                return NotFound();
            }

            await _doorHubContext.Clients.All.SendAsync("SendDoorStatus", updatedDoorRecord.Id, updatedDoorRecord.IsOpen, updatedDoorRecord.IsLocked);

            //DoorHub hub = new DoorHub();
            //await hub.SendDoorStatus(updatedDoorRecord.Id, updatedDoorRecord.IsOpen, updatedDoorRecord.IsLocked);

            return new DoorModel
            {
                Id = updatedDoorRecord.Id,
                Label = updatedDoorRecord.Label,
                IsOpen = updatedDoorRecord.IsOpen,
                IsLocked = updatedDoorRecord.IsLocked
            };


        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while updating door with ID: {DoorId}", doorId);
            throw;
        }
    }

    [HttpDelete("{doorId}")]
    public async Task<ActionResult> DeleteDoor([FromRoute][Required] string doorId)
    {
        try
        {
            var door = await _doorRepositoryService.GetDoor(doorId);
            if (door == null)
            {
                return NotFound();
            }

            await _doorRepositoryService.RemoveDoor(doorId);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while deleting door with ID: {DoorId}", doorId);
            throw;
        }
    }    
}