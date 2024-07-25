using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL_BLL
{
    public class DS_SinhVien
    {
        QL_KHOAHOCDataContext db = new QL_KHOAHOCDataContext();
        public List<UserRole> GetData()
        {
            var sanphams = from d in db.UserRoles select d;
            List<UserRole> list_sanpham = sanphams.ToList<UserRole>();
            return list_sanpham;
        }
    }
}
