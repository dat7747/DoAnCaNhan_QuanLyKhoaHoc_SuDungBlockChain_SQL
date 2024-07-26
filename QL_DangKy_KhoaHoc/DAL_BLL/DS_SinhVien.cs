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

        public List<UserRole> SearchData(string searchText)
        {
            var results = from d in db.UserRoles
                          where d.address.Contains(searchText)
                          select d;
            return results.ToList();
        }
        public void AddOrUpdate(UserRole userRole)
        {
            var existing = db.UserRoles.SingleOrDefault(d => d.address == userRole.address);
            if (existing != null)
            {
                // Update existing record
                existing.role = userRole.role;
                existing.status = userRole.status;
            }
            else
            {
                // Add new record
                db.UserRoles.InsertOnSubmit(userRole);
            }

            db.SubmitChanges();
        }

        public void Delete(UserRole userRole)
        {
            var existingUserRole = db.UserRoles.SingleOrDefault(u => u.address == userRole.address);
            if (existingUserRole != null)
            {
                db.UserRoles.DeleteOnSubmit(existingUserRole);
                db.SubmitChanges();
            }
        }
    }
}
