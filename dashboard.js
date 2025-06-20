document.addEventListener('DOMContentLoaded', () => {
  function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "flex";
  }

  function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
  }

  showLoader(); // ⬅️ Tampilkan loader saat halaman dimuat

  const pathname = window.location.pathname;

  // DASHBOARD
  if (pathname.includes("dashboard.html")) {
    const fetchTransaksi = fetch('https://script.google.com/macros/s/AKfycbxL9n0sQfUP4-hvne-_MYZhlHBfA1-8X7hqOm-Gao43gYt8vJXzo7Tr_kWYZYTuLvGd/exec?action=ambilTransaksi')
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
        notifikasiEl.textContent =
          totalPengeluaran > totalPemasukan * 0.5
            ? "🚨 Pengeluaran bulan ini telah melebihi 50% dari pemasukan."
            : "✅ Keuangan masih stabil bulan ini.";

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
      });

    const fetchTambahan = fetch('https://script.google.com/macros/s/AKfycbxL9n0sQfUP4-hvne-_MYZhlHBfA1-8X7hqOm-Gao43gYt8vJXzo7Tr_kWYZYTuLvGd/exec?action=ambilData')
      .then(res => res.json());

    Promise.all([fetchTransaksi, fetchTambahan]).finally(() => hideLoader());
  }

  // Tombol logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
});

// Sidebar toggle
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('active');
}

document.addEventListener('click', function (event) {
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.querySelector('.hamburger');
  if (sidebar && hamburger && sidebar.classList.contains('active') &&
      !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
    sidebar.classList.remove('active');
  }
});
