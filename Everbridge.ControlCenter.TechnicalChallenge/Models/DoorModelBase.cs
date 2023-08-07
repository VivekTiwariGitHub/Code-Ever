using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;
using Newtonsoft.Json;

namespace Everbridge.ControlCenter.TechnicalChallenge.Models
{
    [DataContract]
    public class DoorModelBase
    {
        [DataMember(Name = "label")]
        [Required]
        public string Label { get; set; }

        [DataMember(Name = "isOpen")]
        [Required]
        public bool IsOpen { get; set; }

        [DataMember(Name = "isLocked")]
        [Required]
        public bool IsLocked { get; set; }

        public string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.None);
        }
    }
}
