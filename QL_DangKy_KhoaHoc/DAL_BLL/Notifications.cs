using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL_BLL
{
    public class Notifications
    {
        QL_KHOAHOCDataContext db = new QL_KHOAHOCDataContext();
        public List<notification> GetNotifications()
        {
            try
            {
                var notifications = db.notifications.Select(n => new notification
                {
                    id = n.id,
                    notification1 = n.notification1,
                    zoom_link = n.zoom_link,
                    session_number = n.session_number,
                    created_at = n.created_at
                }).ToList();

                return notifications;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return new List<notification>();
            }
        }
        // Phương thức tìm thông báo theo session_number
        public List<notification> SearchBySession(int sessionNumber)
        {
            try
            {
                var result = db.notifications
                    .Where(n => n.id == sessionNumber)
                    .Select(n => new notification
                    {
                        id = n.id,
                        notification1 = n.notification1,
                        zoom_link = n.zoom_link,
                        session_number = n.session_number,
                        created_at = n.created_at
                    })
                    .ToList();

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return new List<notification>();
            }
        }

        // Phương thức tìm thông báo theo ngày
        public List<notification> SearchByDate(DateTime date)
        {
            try
            {
                var result = db.notifications
                    .Where(n => n.created_at.HasValue && n.created_at.Value.Date == date.Date)
                    .Select(n => new notification
                    {
                        id = n.id,
                        notification1 = n.notification1,
                        zoom_link = n.zoom_link,
                        session_number = n.session_number,
                        created_at = n.created_at
                    })
                    .ToList();

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return new List<notification>();
            }
        }
    }
}

