using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL_BLL
{
    public class UserAttenDance
    {
        QL_KHOAHOCDataContext db = new QL_KHOAHOCDataContext();
        public List<UserAttendance> GetAllUserAttendances()
        {
            try
            {
                var result = db.UserAttendances
                    .Select(ua => new UserAttendance
                    {
                        courseId = ua.courseId,
                        address = ua.address,
                        sessionNumber = ua.sessionNumber,
                        attended = ua.attended
                    })
                    .ToList();

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return new List<UserAttendance>();
            }
        }

        // Phương thức tìm kiếm theo địa chỉ
        public List<UserAttendance> SearchByAddress(string address)
        {
            try
            {
                var result = db.UserAttendances
                    .Where(ua => ua.address.Contains(address))
                    .Select(ua => new UserAttendance
                    {
                        courseId = ua.courseId,
                        address = ua.address,
                        sessionNumber = ua.sessionNumber,
                        attended = ua.attended
                    })
                    .ToList();

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return new List<UserAttendance>();
            }
        }

        // Phương thức tìm kiếm theo lớp học (courseId)
        public List<UserAttendance> SearchByCourseId(int courseId)
        {
            try
            {
                var result = db.UserAttendances
                    .Where(ua => ua.courseId == courseId)
                    .Select(ua => new UserAttendance
                    {
                        courseId = ua.courseId,
                        address = ua.address,
                        sessionNumber = ua.sessionNumber,
                        attended = ua.attended
                    })
                    .ToList();

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return new List<UserAttendance>();
            }
        }
    }
}
