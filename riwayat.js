// Ganti URL ini dengan URL Web App kamu yang sudah di-deploy
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxL9n0sQfUP4-hvne-_MYZhlHBfA1-8X7hqOm-Gao43gYt8vJXzo7Tr_kWYZYTuLvGd/exec";

const riwayatTableBody = document.getElementById("riwayatTableBody");
let semuaTransaksi = [];

// Saat halaman dimuat, ambil data transaksi
fetchDataRiwayat();

function fetchDataRiwayat() {
  fetch(`${SCRIPT_URL}?action=ambilTransaksi`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        semuaTransaksi = data.data;
        renderTabel(semuaTransaksi);
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
    riwayatTableBody.innerHTML = "<tr><td colspan='4'>Tidak ada transaksi yang sesuai filter.</td></tr>";
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
      <td>Rp ${parseInt(item.jumlah).toLocaleString("id-ID")}</td>
    `;
    riwayatTableBody.appendChild(row);
  });
}

// 🎯 Filter form handler
document.getElementById("filterForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const tanggalInputRaw = document.getElementById("filterTanggal").value.trim();
  const kategoriInput = document.getElementById("filterKategori").value.toLowerCase().trim();

  // Format tanggal ke YYYY-MM-DD jika tidak kosong
  let formattedTanggal = "";
  if (tanggalInputRaw) {
    const tanggalInput = new Date(tanggalInputRaw);
    if (!isNaN(tanggalInput)) {
      formattedTanggal = tanggalInput.toISOString().split("T")[0];
    }
  }

const hasilFilter = semuaTransaksi.filter(item => {
  let tanggalItem = "";

  try {
    tanggalItem = new Date(item.tanggal).toISOString().split("T")[0];
  } catch (e) {
    tanggalItem = item.tanggal; // fallback kalau parsing gagal
  }

  const cocokTanggal = formattedTanggal ? tanggalItem === formattedTanggal : true;
  const cocokKategori = kategoriInput ? item.kategori.toLowerCase().includes(kategoriInput) : true;
  return cocokTanggal && cocokKategori;
});

  renderTabel(hasilFilter);
});

// 🔁 Reset filter
document.getElementById("resetFilter").addEventListener("click", () => {
  document.getElementById("filterForm").reset();
  renderTabel(semuaTransaksi);
});

// 🔐 Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

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
