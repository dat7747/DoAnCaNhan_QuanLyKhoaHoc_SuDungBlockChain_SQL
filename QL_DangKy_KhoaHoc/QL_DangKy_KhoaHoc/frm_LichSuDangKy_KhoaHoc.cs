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
    public partial class frm_LichSuDangKy_KhoaHoc : DevExpress.XtraEditors.XtraForm
    {
        Course_RegistrationHistory courseRegHistory = new Course_RegistrationHistory();
        public frm_LichSuDangKy_KhoaHoc()
        {
            InitializeComponent();
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void frm_LichSuDangKy_KhoaHoc_Load(object sender, EventArgs e)
        {
            LoadCourseRegistrationHistory();
        }
        private void LoadCourseRegistrationHistory()
        {
           
            var histories = courseRegHistory.GetAllCourseRegistrationHistories();

            // Gán dữ liệu cho DataGridView
            dataGridView1.DataSource = histories;

            // Ẩn cột không mong muốn
            dataGridView1.Columns["course"].Visible = false;

            // Thiết lập ReadOnly cho toàn bộ DataGridView
            dataGridView1.ReadOnly = true;

            // Đặt tiêu đề cho các cột và in đậm tiêu đề
            dataGridView1.Columns["registrationId"].HeaderText = "Registration ID";
            dataGridView1.Columns["courseId"].HeaderText = "Course ID";
            dataGridView1.Columns["senderAddress"].HeaderText = "Sender Address";
            dataGridView1.Columns["registrationTime"].HeaderText = "Registration Time";
            dataGridView1.Columns["transactionHash"].HeaderText = "Transaction Hash";

            foreach (DataGridViewColumn column in dataGridView1.Columns)
            {
                column.HeaderCell.Style.Font = new Font("Segoe UI", 11, FontStyle.Bold);
            }
        }

        private void txt_search_lop_TextChanged(object sender, EventArgs e)
        {
            if (int.TryParse(txt_search_lop.Text.Trim(), out int courseId))
            {
                var histories = courseRegHistory.SearchByClass(courseId);
                dataGridView1.DataSource = histories;
            }
            else
            {
                LoadCourseRegistrationHistory();
            }
        }

        private void txt_search_address_TextChanged(object sender, EventArgs e)
        {
            string address = txt_search_address.Text.Trim();
            var histories = courseRegHistory.SearchByAddress(address);
            dataGridView1.DataSource = histories;
        }

        private void dtpk_search_day_ValueChanged(object sender, EventArgs e)
        {
            DateTime selectedDate = dtpk_search_day.Value;
            var histories = courseRegHistory.SearchByDate(selectedDate);
            dataGridView1.DataSource = histories;
        }

        private void simpleButton1_Click(object sender, EventArgs e)
        {
            LoadCourseRegistrationHistory();
        }
    
    }
}