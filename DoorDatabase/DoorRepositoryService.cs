using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Everbridge.ControlCenter.TechnicalChallenge.DoorDatabase
{
    public class DoorRepositoryService
    {
        private readonly DoorRepositoryDatabaseContext _userRepositoryDatabaseContext;

        public DoorRepositoryService(DoorRepositoryDatabaseContext userRepositoryDatabaseContext)
        {
            _userRepositoryDatabaseContext = userRepositoryDatabaseContext;
        }

        public async Task<List<string>> GetDoorsIds()
        {
            return _userRepositoryDatabaseContext.Doors.Select(x => x.Id).ToList();
        }

        public async Task<List<DoorRecordDto>> GetDoors()
        {
            return _userRepositoryDatabaseContext.Doors.Select(x => new DoorRecordDto(x)).ToList();
        }

        public async Task<DoorRecordDto> GetDoor(string doorId)
        {
            var user = await _userRepositoryDatabaseContext.Doors.FindAsync(doorId);
            return (user != null) ? new DoorRecordDto(user) : null;
        }

        public async Task<DoorRecordDto> AddDoor(DoorRecordDto door)
        {
            var record = new DoorRecord
            {
                Label = door.Label,
                IsLocked = door.IsLocked,
                IsOpen = door.IsOpen
            };
            await _userRepositoryDatabaseContext.Doors.AddAsync(record);
            await _userRepositoryDatabaseContext.SaveChangesAsync();
            return new DoorRecordDto(record);
        }

        public async Task<DoorRecordDto> RemoveDoor(string doorId)
        {
            var record = await _userRepositoryDatabaseContext.Doors.FindAsync(doorId);
            if (record == null)
            {
                return null;
            }

            _userRepositoryDatabaseContext.Remove(record);
            await _userRepositoryDatabaseContext.SaveChangesAsync();

            return new DoorRecordDto(record);
        }

        public async Task<DoorRecordDto> UpdateDoor(DoorRecordDto door)
        {
            var record = await _userRepositoryDatabaseContext.Doors.FindAsync(door.Id);
            if (record == null)
            {
                return null;
            }

            record.Label = door.Label;
            record.IsOpen = door.IsOpen;
            record.IsLocked = door.IsLocked;

            _userRepositoryDatabaseContext.Update(record);
            await _userRepositoryDatabaseContext.SaveChangesAsync();

            return new DoorRecordDto(record);
        }
    }
}
