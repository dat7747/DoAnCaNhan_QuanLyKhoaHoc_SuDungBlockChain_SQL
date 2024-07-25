using DevExpress.XtraBars;
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
    public partial class frm_TrangChu : DevExpress.XtraBars.Ribbon.RibbonForm
    {
        Course cs = new Course();
        public frm_TrangChu()
        {
            InitializeComponent();

        }

        private void barButtonItem1_ItemClick(object sender, ItemClickEventArgs e)
        {
            frm_KhoaHoc fr = new frm_KhoaHoc();
            fr.MdiParent = this;
            fr.Show();
        }

        private void frm_TrangChu_Load(object sender, EventArgs e)
        {
        }

        private void barButtonItem2_ItemClick(object sender, ItemClickEventArgs e)
        {
        }

        private void q_ItemClick(object sender, ItemClickEventArgs e)
        {
            frm_LichSuDangKy_KhoaHoc fr = new frm_LichSuDangKy_KhoaHoc();
            fr.MdiParent = this;
            fr.Show();
        }

        private void btn_ThongBao_ItemClick(object sender, ItemClickEventArgs e)
        {
            frm_LichSuThongBao fr = new frm_LichSuThongBao();
            fr.MdiParent = this;
            fr.Show();
        }

        private void barButtonItem3_ItemClick(object sender, ItemClickEventArgs e)
        {
            frm_DiemDanh fr = new frm_DiemDanh();
            fr.MdiParent = this;
            fr.Show();
        }

        private void barButtonItem18_ItemClick(object sender, ItemClickEventArgs e)
        {
            frm_RutToken fr = new frm_RutToken();
            fr.MdiParent = this;
            fr.Show();
        }

        private void barButtonItem5_ItemClick(object sender, ItemClickEventArgs e)
        {
            frm_DSHocVien fr = new frm_DSHocVien();
            fr.MdiParent = this;
            fr.Show();
        }
    }
}