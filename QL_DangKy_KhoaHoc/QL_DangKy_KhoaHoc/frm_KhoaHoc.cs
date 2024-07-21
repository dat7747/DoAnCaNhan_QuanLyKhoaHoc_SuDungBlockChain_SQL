﻿using DevExpress.XtraEditors;
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
    public partial class frm_KhoaHoc : DevExpress.XtraEditors.XtraForm
    {
        Course cs = new Course();
        public frm_KhoaHoc()
        {
            InitializeComponent();
        }

        private void tableLayoutPanel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void groupBox1_Enter(object sender, EventArgs e)
        {

        }

        private void frm_KhoaHoc_Load(object sender, EventArgs e)
        {
            // Thiết lập giá trị cho cbb_status
            cbb_status.Items.Add("open");
            cbb_status.Items.Add("closed");

            // Tải dữ liệu lên dataGridView1
            dataGridView1.DataSource = cs.GetCourses();

            // Thiết lập dataGridView1 chỉ đọc
            dataGridView1.ReadOnly = true;
            dataGridView1.SelectionChanged += DataGridView1_SelectionChanged;
            dataGridView1.Columns["classDescription"].Visible = false;
            dataGridView1.Columns["startTime"].Visible = false;
            dataGridView1.Columns["endTime"].Visible = false;
        }

        private void DataGridView1_SelectionChanged(object sender, EventArgs e)
        {
            if (dataGridView1.SelectedRows.Count > 0)
            {
                DataGridViewRow selectedRow = dataGridView1.SelectedRows[0];
                label_idcourse.Text = selectedRow.Cells["id"].Value.ToString();

                var price = selectedRow.Cells["price"].Value != null ? selectedRow.Cells["price"].Value.ToString() : "N/A";
                var session = selectedRow.Cells["session"].Value != null ? selectedRow.Cells["session"].Value.ToString() : "N/A";
                label_pirceandsession.Text = $"{price} EDU - {session} Buổi";

                cbb_status.SelectedItem = selectedRow.Cells["status"].Value != null ? selectedRow.Cells["status"].Value.ToString() : "N/A";

                txt_tenLopHoc.Text = selectedRow.Cells["className"].Value != null ? selectedRow.Cells["className"].Value.ToString() : "";
                txt_chiTiet.Text = selectedRow.Cells["classDescription"].Value != null ? selectedRow.Cells["classDescription"].Value.ToString() : "";

                if (selectedRow.Cells["startTime"].Value != null && selectedRow.Cells["startTime"].Value != DBNull.Value)
                {
                    dtpk_ngayBatDau.Value = Convert.ToDateTime(selectedRow.Cells["startTime"].Value);
                }
                else
                {
                    dtpk_ngayBatDau.Value = DateTime.Now;
                }

                if (selectedRow.Cells["endTime"].Value != null && selectedRow.Cells["endTime"].Value != DBNull.Value)
                {
                    dtpk_ngayKetThuc.Value = Convert.ToDateTime(selectedRow.Cells["endTime"].Value);
                }
                else
                {
                    dtpk_ngayKetThuc.Value = DateTime.Now;
                }
            }
        }

        private void simpleButton1_Click(object sender, EventArgs e)
        {
            cbb_status.Enabled = true;
            txt_tenLopHoc.Enabled = true;
            txt_chiTiet.Enabled = true;
            dtpk_ngayBatDau.Enabled = true;
            dtpk_ngayKetThuc.Enabled = true;
            btn_Luu.Enabled = true;

        }

        private void simpleButton3_Click(object sender, EventArgs e)
        {
            int courseId = int.Parse(label_idcourse.Text);
            string className = txt_tenLopHoc.Text;
            string classDescription = txt_chiTiet.Text;
            DateTime startTime = dtpk_ngayBatDau.Value;
            DateTime endTime = dtpk_ngayKetThuc.Value;

            try
            {
                cs.SaveOrUpdateClassDetails(courseId, className, classDescription, startTime, endTime);

                LoadDataGridView();

                clear();
                btn_Luu.Enabled = false;

                MessageBox.Show("Lưu thông tin thành công!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Có lỗi xảy ra: {ex.Message}", "Thông báo lỗi", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            btn_Luu.Enabled = false;
        }

        private void clear()
        {
            label_idcourse.Text = "";
            label_pirceandsession.Text = "";
            cbb_status.SelectedIndex = -1; // Đặt lại combobox
            txt_tenLopHoc.Text = "";
            txt_chiTiet.Text = "";
            dtpk_ngayBatDau.Value = DateTime.Now;
            dtpk_ngayKetThuc.Value = DateTime.Now;
        }

        private void btn_lamMoi_Click(object sender, EventArgs e)
        {
            LoadDataGridView();
        }
        private void LoadDataGridView()
        {
            dataGridView1.DataSource = cs.GetCourses();

            // Ẩn các cột không cần hiển thị
            dataGridView1.Columns["classDescription"].Visible = false;
            dataGridView1.Columns["startTime"].Visible = false;
            dataGridView1.Columns["endTime"].Visible = false;
        }

        private void btn_Xoa_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Không thể xóa được, lớp học đang được quản lý bởi BlockChain", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
    }
    
}