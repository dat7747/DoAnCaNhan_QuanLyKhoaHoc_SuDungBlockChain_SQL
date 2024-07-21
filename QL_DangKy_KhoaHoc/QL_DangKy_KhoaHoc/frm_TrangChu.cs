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
    }
}