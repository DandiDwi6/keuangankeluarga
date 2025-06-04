// Ganti URL ini dengan URL Web App kamu yang sudah di-deploy
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxL9n0sQfUP4-hvne-_MYZhlHBfA1-8X7hqOm-Gao43gYt8vJXzo7Tr_kWYZYTuLvGd/exec";

const riwayatTableBody = document.getElementById("riwayatTableBody");

// Saat halaman dimuat, ambil data transaksi
fetchDataRiwayat();

function fetchDataRiwayat() {
  fetch(`${SCRIPT_URL}?action=ambilTransaksi`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        renderTabel(data.data);
      } else {
        riwayatTableBody.innerHTML = "<tr><td colspan='4'>Gagal memuat data.</td></tr>";
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      riwayatTableBody.innerHTML = "<tr><td colspan='4'>Terjadi kesalahan saat mengambil data.</td></tr>";
    });
}

function renderTabel(dataTransaksi) {
  riwayatTableBody.innerHTML = "";

  if (dataTransaksi.length === 0) {
    riwayatTableBody.innerHTML = "<tr><td colspan='4'>Belum ada transaksi.</td></tr>";
    return;
  }

  // Urutkan dari terbaru ke terlama
  dataTransaksi.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  dataTransaksi.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.jenis === "pemasukan" ? "Pemasukan" : "Pengeluaran"}</td>
      <td>${item.kategori}</td>
      <td>Rp ${parseInt(item.jumlah).toLocaleString()}</td>
    `;
    riwayatTableBody.appendChild(row);
  });
}

// Sidebar toggle
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
