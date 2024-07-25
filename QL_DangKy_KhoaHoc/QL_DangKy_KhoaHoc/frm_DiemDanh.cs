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
    public partial class frm_DiemDanh : DevExpress.XtraEditors.XtraForm
    {
        UserAttenDance userAttenDance = new UserAttenDance();
        public frm_DiemDanh()
        {
            InitializeComponent();
            hienthi();
            dataGridView1.CellFormatting += DataGridView1_CellFormatting;
        }

        private void DataGridView1_CellFormatting(object sender, DataGridViewCellFormattingEventArgs e)
        {
            if (dataGridView1.Columns[e.ColumnIndex].Name == "attended")
            {
                // Kiểm tra giá trị của ô và tô màu nếu cần
                if (e.Value != null && e.Value is byte attendedValue)
                {
                    // Nếu attended = 1, tô màu xanh
                    if (attendedValue == 1)
                    {
                        e.Value = "Đã vào học";
                        e.CellStyle.BackColor = Color.LightBlue; // Màu xanh nhạt
                    }
                    else
                    {
                        e.CellStyle.BackColor = Color.White; // Màu nền mặc định
                    }
                }
            }
        }

        public void hienthi()
        {
            var thongbao = userAttenDance.GetAllUserAttendances();
            // Gán dữ liệu cho userAttenDance
            dataGridView1.DataSource = thongbao;

            // Ẩn cột không mong muốn
            //dataGridView1.Columns["course"].Visible = false;

            // Thiết lập ReadOnly cho toàn bộ DataGridView
            dataGridView1.ReadOnly = true;

            // Đặt tiêu đề cho các cột và in đậm tiêu đề
            dataGridView1.Columns["courseId"].HeaderText = "ID Course";
            dataGridView1.Columns["address"].HeaderText = "Address User";
            dataGridView1.Columns["sessionNumber"].HeaderText = "Number Session";
            dataGridView1.Columns["attended"].HeaderText = "Attended";

            foreach (DataGridViewColumn column in dataGridView1.Columns)
            {
                column.HeaderCell.Style.Font = new Font("Segoe UI", 11, FontStyle.Bold);
            }
        }

        private void txt_search_lop_TextChanged(object sender, EventArgs e)
        {
            if (int.TryParse(txt_search_lop.Text, out int courseId))
            {
                var results = userAttenDance.SearchByCourseId(courseId);
                dataGridView1.DataSource = results;
            }
            else
            {
                dataGridView1.DataSource = new List<UserAttendance>();
            }
        }

        private void txt_search_address_TextChanged(object sender, EventArgs e)
        {
            string address = txt_search_address.Text;
            var results = userAttenDance.SearchByAddress(address);
            dataGridView1.DataSource = results;
        }

        private void simpleButton1_Click(object sender, EventArgs e)
        {
            hienthi();
        }
    }
}