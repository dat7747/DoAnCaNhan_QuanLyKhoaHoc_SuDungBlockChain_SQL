using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlTypes;

namespace DAL_BLL
{
    public class Course_RegistrationHistory
    {
        QL_KHOAHOCDataContext db = new QL_KHOAHOCDataContext();
        public List<CourseRegistrationHistory> GetAllCourseRegistrationHistories()
        {
            try
            {
                // Truy vấn tất cả các bản ghi từ bảng CourseRegistrationHistory
                var result = db.CourseRegistrationHistories.ToList();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return new List<CourseRegistrationHistory>();
            }
        }
        // Tìm kiếm theo lớp học
        public List<CourseRegistrationHistory> SearchByClass(int courseId)
        {
            try
            {
                var result = db.CourseRegistrationHistories
                    .Where(crh => crh.courseId == courseId)
                    .ToList();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return new List<CourseRegistrationHistory>();
            }
        }

        // Tìm kiếm theo địa chỉ học viên
        public List<CourseRegistrationHistory> SearchByAddress(string address)
        {
            try
            {
                var result = db.CourseRegistrationHistories
                    .Where(crh => crh.senderAddress.Contains(address))
                    .ToList();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return new List<CourseRegistrationHistory>();
            }
        }

        //Tìm kiếm theo ngày đăng ký
        public List<CourseRegistrationHistory> SearchByDate(DateTime date)
        {
            try
            {
                var result = db.CourseRegistrationHistories
                    .Where(crh => crh.registrationTime.HasValue && crh.registrationTime.Value.Date == date.Date)
                    .ToList();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return new List<CourseRegistrationHistory>();
            }
        }
    }
}
