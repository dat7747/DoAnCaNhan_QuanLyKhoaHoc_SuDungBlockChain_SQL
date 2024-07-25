using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace DAL_BLL
{
    public class TokenWithdrawalDTO
    {
        public int id { get; set; }
        public string sender_address { get; set; }
        public string recipient_address { get; set; }
        public double amount { get; set; }  // Change to double
        public string transaction_hash { get; set; }
        public string status { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
    }
}
