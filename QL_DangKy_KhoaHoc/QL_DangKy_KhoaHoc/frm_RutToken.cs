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
    public partial class frm_RutToken : DevExpress.XtraEditors.XtraForm
    {
        public frm_RutToken()
        {
            InitializeComponent();
            LoadTokenWithdrawals();
        }
        private void LoadTokenWithdrawals()
        {
            TokenWithdrawals tw = new TokenWithdrawals();
            List<TokenWithdrawalDTO> tokenWithdrawals = tw.GetTokenWithdrawals();

            dataGridView1.DataSource = tokenWithdrawals;

            // Tùy chỉnh DataGridView nếu cần
            dataGridView1.Columns["id"].HeaderText = "ID";
            dataGridView1.Columns["sender_address"].HeaderText = "Sender Address";
            dataGridView1.Columns["recipient_address"].HeaderText = "Recipient Address";
            dataGridView1.Columns["amount"].HeaderText = "Amount";
            dataGridView1.Columns["transaction_hash"].HeaderText = "Transaction Hash";
            dataGridView1.Columns["status"].HeaderText = "Status";
            dataGridView1.Columns["created_at"].HeaderText = "Created At";
            dataGridView1.Columns["updated_at"].HeaderText = "Updated At";

            // In đậm header
            foreach (DataGridViewColumn column in dataGridView1.Columns)
            {
                column.HeaderCell.Style.Font = new Font("Arial", 10, FontStyle.Bold);
            }
        }
    }
}