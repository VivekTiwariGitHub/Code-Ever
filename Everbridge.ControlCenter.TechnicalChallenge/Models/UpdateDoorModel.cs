using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;
using Newtonsoft.Json;

namespace Everbridge.ControlCenter.TechnicalChallenge.Models
{
    [DataContract]
    public class UpdateDoorModel: DoorModelBase
    {
        [DataMember(Name = "id")]
        [Required]
        public string Id { get; set; }        
    }
}
