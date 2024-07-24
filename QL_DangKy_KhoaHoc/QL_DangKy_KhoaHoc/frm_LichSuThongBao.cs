using DevExpress.XtraEditors;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using DAL_BLL;
namespace QL_DangKy_KhoaHoc
{
    public partial class frm_LichSuThongBao : DevExpress.XtraEditors.XtraForm
    {
        Notifications notification = new Notifications();
        public frm_LichSuThongBao()
        {
            InitializeComponent();
        }

        public void hienthi()
        {
            var thongbao = notification.GetNotifications();
            // Gán dữ liệu cho DataGridView
            dataGridView1.DataSource = thongbao;

            // Ẩn cột không mong muốn
            //dataGridView1.Columns["course"].Visible = false;

            // Thiết lập ReadOnly cho toàn bộ DataGridView
            dataGridView1.ReadOnly = true;

            // Đặt tiêu đề cho các cột và in đậm tiêu đề
            dataGridView1.Columns["id"].HeaderText = "ID Course";
            dataGridView1.Columns["notification1"].HeaderText = "Notification";
            dataGridView1.Columns["zoom_link"].HeaderText = "Link Zoom";
            dataGridView1.Columns["session_number"].HeaderText = "Nummber Session";
            dataGridView1.Columns["created_at"].HeaderText = "Create at";

            foreach (DataGridViewColumn column in dataGridView1.Columns)
            {
                column.HeaderCell.Style.Font = new Font("Segoe UI", 11, FontStyle.Bold);
            }
        }

        private void frm_LichSuThongBao_Load(object sender, EventArgs e)
        {
            hienthi();
        }

        private void simpleButton1_Click(object sender, EventArgs e)
        {
            hienthi();
        }

        private void txt_search_lop_TextChanged(object sender, EventArgs e)
        {
            if (int.TryParse(txt_search_lop.Text, out int sessionNumber))
            {
                var results = notification.SearchBySession(sessionNumber);
                dataGridView1.DataSource = results;
            }
            else
            {
                dataGridView1.DataSource = new List<notification>();
            }
        }

        private void dtpk_search_day_ValueChanged(object sender, EventArgs e)
        {
            var selectedDate = dtpk_search_day.Value.Date;
            var results = notification.SearchByDate(selectedDate);
            dataGridView1.DataSource = results;
        }
    }
}