document.addEventListener('DOMContentLoaded', () => {
  const sheetURL = 'https://script.google.com/macros/s/AKfycbxL9n0sQfUP4-hvne-_MYZhlHBfA1-8X7hqOm-Gao43gYt8vJXzo7Tr_kWYZYTuLvGd/exec?action=ambilTransaksi';

  fetch(sheetURL)
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        alert("Gagal memuat data transaksi.");
        return;
      }

      const transaksi = data.data;
      let totalPemasukan = 0;
      let totalPengeluaran = 0;
      const pengeluaranPerKategori = {};
      const transaksiTerbaruEl = document.getElementById("transaksi-terbaru");

      transaksi.reverse().slice(0, 5).forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.jenis === 'pemasukan' ? '+' : '-'} Rp ${parseInt(item.jumlah).toLocaleString("id-ID")} ${item.kategori ? 'untuk ' + item.kategori : ''}`;
        transaksiTerbaruEl.appendChild(li);
      });

      transaksi.forEach(item => {
        const jumlah = parseInt(item.jumlah);
        if (item.jenis === 'pemasukan') {
          totalPemasukan += jumlah;
        } else if (item.jenis === 'pengeluaran') {
          totalPengeluaran += jumlah;
          pengeluaranPerKategori[item.kategori] = (pengeluaranPerKategori[item.kategori] || 0) + jumlah;
        }
      });

      const sisaSaldo = totalPemasukan - totalPengeluaran;

      document.getElementById("pemasukan").textContent = totalPemasukan.toLocaleString("id-ID");
      document.getElementById("pengeluaran").textContent = totalPengeluaran.toLocaleString("id-ID");
      document.getElementById("sisaSaldo").textContent = sisaSaldo.toLocaleString("id-ID");

      const progress = document.getElementById("tabunganProgress");
      progress.value = sisaSaldo;

      const notifikasiEl = document.getElementById("notifikasi");
      if (totalPengeluaran > totalPemasukan * 0.5) {
        notifikasiEl.textContent = "🚨 Pengeluaran bulan ini telah melebihi 50% dari pemasukan.";
      } else {
        notifikasiEl.textContent = "✅ Keuangan masih stabil bulan ini.";
      }

      // Buat pie chart berdasarkan pengeluaran per kategori
      const ctx = document.getElementById('chartPengeluaran').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(pengeluaranPerKategori),
          datasets: [{
            label: 'Pengeluaran',
            data: Object.values(pengeluaranPerKategori),
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#8bc34a', '#f06292', '#4db6ac'],
            hoverOffset: 4
          }]
        }
      });
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Terjadi kesalahan saat mengambil data.");
    });

  // Tombol logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});

// Toggle menu
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('active');
}

// Tutup sidebar jika klik di luar
document.addEventListener('click', function (event) {
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.querySelector('.hamburger');

  if (
    sidebar.classList.contains('active') &&
    !sidebar.contains(event.target) &&
    !hamburger.contains(event.target)
  ) {
    sidebar.classList.remove('active');
  }
});
