using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlTypes;

namespace DAL_BLL
{
    public class Course
    {
        QL_KHOAHOCDataContext db = new QL_KHOAHOCDataContext();
        public List<dynamic> GetCourses()
        {
            try
            {
                var courses = from c in db.courses
                              join cd in db.ClassDetails on c.id equals cd.courseId into details
                              from cd in details.DefaultIfEmpty()
                              select new
                              {
                                  c.id,
                                  c.price,
                                  c.session,
                                  c.status,
                                  className = cd != null ? cd.className : string.Empty,
                                  classDescription = cd != null ? cd.classDescription : string.Empty,
                                  startTime = cd != null ? (DateTime?)cd.startTime : null,
                                  endTime = cd != null ? (DateTime?)cd.endTime : null
                              };

                return courses.ToList<dynamic>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return null;
            }
        }
        public void SaveOrUpdateClassDetails(int courseId, string className, string classDescription, DateTime startTime, DateTime endTime)
        {
            try
            {
                var existingClassDetail = db.ClassDetails.FirstOrDefault(cd => cd.courseId == courseId);

                if (existingClassDetail != null)
                {
                    // Cập nhật bản ghi hiện tại
                    existingClassDetail.className = className;
                    existingClassDetail.classDescription = classDescription;
                    existingClassDetail.startTime = startTime;
                    existingClassDetail.endTime = endTime;
                }
                else
                {
                    // Thêm bản ghi mới
                    ClassDetail newClassDetail = new ClassDetail
                    {
                        courseId = courseId,
                        className = className,
                        classDescription = classDescription,
                        startTime = startTime,
                        endTime = endTime
                    };

                    db.ClassDetails.InsertOnSubmit(newClassDetail);
                }

                db.SubmitChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }
    }
}
