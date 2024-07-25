using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL_BLL
{
    public class CourseRegistrationHistoryDTO
    {
        public int registrationId { get; set; }
        public int courseId { get; set; }
        public string senderAddress { get; set; }
        public DateTime? registrationTime { get; set; }
        public string transactionHash { get; set; }
        public string gmail { get; set; }  // Thêm thuộc tính gmail
    }
}
