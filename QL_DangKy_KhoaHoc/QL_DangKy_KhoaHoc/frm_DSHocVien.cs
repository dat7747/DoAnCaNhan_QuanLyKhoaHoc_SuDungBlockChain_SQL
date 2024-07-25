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
    public partial class frm_DSHocVien : DevExpress.XtraEditors.XtraForm
    {
        DS_SinhVien us = new DS_SinhVien();
        public frm_DSHocVien()
        {
            InitializeComponent();
            hienthi();
        }

        private void hienthi()
        {

            var histories = us.GetData();

            // Gán dữ liệu cho DataGridView
            dataGridView1.DataSource = histories;

            dataGridView1.Font = new Font("Segoe UI", 10, FontStyle.Regular);

            // Thiết lập ReadOnly cho toàn bộ DataGridView
            dataGridView1.ReadOnly = true;

            // Đặt tiêu đề cho các cột và in đậm tiêu đề
            dataGridView1.Columns["id"].HeaderText = "ID";
            dataGridView1.Columns["address"].HeaderText = "Adress";
            dataGridView1.Columns["role"].HeaderText = "Role";
            dataGridView1.Columns["status"].HeaderText = "Status";


            foreach (DataGridViewColumn column in dataGridView1.Columns)
            {
                column.HeaderCell.Style.Font = new Font("Segoe UI", 11, FontStyle.Bold);
            }
        }

        private void dataGridView1_CellFormatting(object sender, DataGridViewCellFormattingEventArgs e)
        {
            if (dataGridView1.Columns[e.ColumnIndex].Name == "status")
            {
                if (e.Value != null && e.Value.ToString() == "1")
                {
                    e.CellStyle.BackColor = Color.LightGreen; // Màu xanh nhạt
                }
                else if (e.Value != null && e.Value.ToString() == "0")
                {
                    e.CellStyle.BackColor = Color.LightCoral; // Màu đỏ nhạt
                }
            }
        }
    }
}