using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SANELSOLAR.DTOs
{
    public class UpdateDTO
    {
        public int UpdatedUserId { get; set; }
        public DateTime UpdatedDate{ get; set; }
        public bool IsActive { get; set; }
    }
}
