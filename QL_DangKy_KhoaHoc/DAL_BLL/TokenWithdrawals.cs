using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Numerics;
using System.IO;

namespace DAL_BLL
{
    public class TokenWithdrawals
    {
        QL_KHOAHOCDataContext db = new QL_KHOAHOCDataContext();

        public List<TokenWithdrawalDTO> GetTokenWithdrawals()
        {
            try
            {
                var tokenWithdrawals = db.TokenWithdrawals
                    .Select(tw => new TokenWithdrawalDTO
                    {
                        id = tw.id,
                        sender_address = tw.sender_address,
                        recipient_address = tw.recipient_address,
                        amount = Convert.ToDouble(tw.amount),  // Convert to double
                        transaction_hash = tw.transaction_hash,
                        status = tw.status,
                        created_at = tw.created_at,
                        updated_at = tw.updated_at
                    })
                    .ToList();

                return tokenWithdrawals;
            }
            catch (Exception ex)
            {
                File.AppendAllText("error_log.txt", $"General Error: {ex.Message}{Environment.NewLine}");
                return new List<TokenWithdrawalDTO>();
            }
        }
    }
}
