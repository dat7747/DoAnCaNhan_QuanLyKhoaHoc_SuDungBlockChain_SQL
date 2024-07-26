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
        List<UserRole> histories;
        public frm_DSHocVien()
        {
            InitializeComponent();
            hienthi();
            cbb_status.DropDownStyle = ComboBoxStyle.DropDownList;
            dataGridView1.ReadOnly = true;
        }

        private void hienthi()
        {

             histories = us.GetData();

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

            var items = new[]
        {
            new { Text = "Đã kích hoạt", Value = 1 },
            new { Text = "Chưa kích hoạt", Value = 0 }
        };
            cbb_status.DisplayMember = "Text";
            cbb_status.ValueMember = "Value";
            cbb_status.DataSource = items;
        }

        private void dataGridView1_CellFormatting(object sender, DataGridViewCellFormattingEventArgs e)
        {
            if (dataGridView1.Columns[e.ColumnIndex].Name == "status" && e.Value != null)
            {
                byte statusValue = (byte)e.Value;
                if (statusValue == 1)
                {
                    e.Value = "Đã kích hoạt";
                    e.CellStyle.BackColor = Color.LightGreen; // Màu xanh nhạt cho trạng thái 1
                }
                else if (statusValue == 0)
                {
                    e.Value = "Chưa kích hoạt";
                    e.CellStyle.BackColor = Color.LightCoral; // Màu đỏ nhạt cho trạng thái 0
                }
                e.FormattingApplied = true; // Báo hiệu rằng định dạng đã được áp dụng
            }
        }

        private void dataGridView1_DataBindingComplete(object sender, DataGridViewBindingCompleteEventArgs e)
        {
           
        }

        private void label4_Click(object sender, EventArgs e)
        {

        }

        private void dataGridView1_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                DataGridViewRow row = dataGridView1.Rows[e.RowIndex];

                // Hiển thị giá trị address vào txt_address
                txt_address.Text = row.Cells["address"].Value.ToString();
                txt_role.Text = row.Cells["role"].Value.ToString();
                // Hiển thị giá trị status vào cbb_status
                byte statusValue = (byte)row.Cells["status"].Value;
                if (statusValue == 1)
                {
                    cbb_status.SelectedValue = 1;
                }
                else
                {
                    cbb_status.SelectedValue = 0;
                }
            }
        }

        private void txt_address_TextChanged(object sender, EventArgs e)
        {

        }

        private void txt_search_address_TextChanged(object sender, EventArgs e)
        {
            string searchText = txt_address.Text.ToLower();

            if (string.IsNullOrWhiteSpace(searchText))
            {
                // Trả lại danh sách ban đầu nếu không có nội dung tìm kiếm
                dataGridView1.DataSource = histories;
            }
            else
            {
                var filteredData = us.SearchData(searchText);
                dataGridView1.DataSource = filteredData;
            }

        }

        private void btn_lammoi_Click(object sender, EventArgs e)
        {
            hienthi();
        }

        private void btn_them_Click(object sender, EventArgs e)
        {
            btn_luu.Enabled = true;
            txt_address.Enabled = true;
            txt_role.Enabled = true;
            cbb_status.Enabled = true;
            btn_them.Enabled = false;
        }

        private void btn_luu_Click(object sender, EventArgs e)
        {
            string address = txt_address.Text;
            string role = txt_role.Text;
            byte status = (byte)(cbb_status.SelectedItem.ToString() == "Đã kích hoạt" ? 1 : 0);

            // Tạo đối tượng UserRole
            UserRole userRole = new UserRole
            {
                address = address,
                role = role,
                status = status
            };

            // Gọi phương thức AddOrUpdate để lưu dữ liệu
            us.AddOrUpdate(userRole);
            MessageBox.Show("Dữ liệu đã được lưu thành công!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Information);
            // Cập nhật DataGridView
            dataGridView1.DataSource = us.GetData();



            dataGridView1.DataSource = us.GetData();
            btn_luu.Enabled = false;
            txt_address.Enabled = false;
            txt_role.Enabled = false;
            cbb_status.Enabled = false;
            txt_address.Clear();
            txt_role.Clear();
            cbb_status.SelectedIndex = -1;
            btn_them.Enabled = true;
        }

        private void btn_xoa_Click(object sender, EventArgs e)
        {
            string address = txt_address.Text;

            // Kiểm tra nếu địa chỉ không rỗng
            if (string.IsNullOrWhiteSpace(address))
            {
                MessageBox.Show("Vui lòng nhập địa chỉ cần xóa.", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            // Hiển thị hộp thoại xác nhận xóa
            DialogResult result = MessageBox.Show("Bạn có chắc chắn muốn xóa địa chỉ này?", "Xác nhận xóa", MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (result == DialogResult.Yes)
            {
                // Tạo đối tượng UserRole để xóa
                UserRole userRole = new UserRole
                {
                    address = address
                };

                // Gọi phương thức Delete để xóa dữ liệu
                us.Delete(userRole);

                // Cập nhật DataGridView
                dataGridView1.DataSource = us.GetData();

                // Hiển thị thông báo thành công
                MessageBox.Show("Dữ liệu đã được xóa thành công!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Information);

                // Xóa giá trị trong các điều khiển
                txt_address.Clear();
                txt_role.Clear();
                cbb_status.SelectedIndex = -1;
            }
        }
    }
}