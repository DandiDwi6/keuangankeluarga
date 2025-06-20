// Ganti URL ini dengan URL Web App kamu yang sudah di-deploy
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxL9n0sQfUP4-hvne-_MYZhlHBfA1-8X7hqOm-Gao43gYt8vJXzo7Tr_kWYZYTuLvGd/exec";

// Ambil referensi elemen
const pengeluaranForm = document.getElementById("pengeluaranForm");
const pengeluaranTableBody = document.getElementById("pengeluaranTableBody");

// Fungsi loading
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "flex";
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

// Saat halaman dimuat, ambil data dari spreadsheet
fetchDataPengeluaran();

// Event: Simpan data saat form disubmit
pengeluaranForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const tanggal = document.getElementById("tanggal").value;
  const kategori = document.getElementById("kategori").value.trim();
  const jumlah = parseInt(document.getElementById("jumlah").value);

  if (!tanggal || !kategori || isNaN(jumlah)) {
    alert("Harap lengkapi semua field.");
    return;
  }

  showLoader();

  // Kirim data ke Google Sheets
  const url = `${SCRIPT_URL}?action=simpanTransaksi&tanggal=${encodeURIComponent(tanggal)}&jenis=pengeluaran&kategori=${encodeURIComponent(kategori)}&jumlah=${encodeURIComponent(jumlah)}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Data pengeluaran berhasil disimpan!");
        pengeluaranForm.reset();
        fetchDataPengeluaran(); // refresh tabel
      } else {
        alert("Gagal menyimpan data.");
        hideLoader();
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Terjadi kesalahan saat mengirim data.");
      hideLoader();
    });
});

// Ambil data dari spreadsheet
function fetchDataPengeluaran() {
  showLoader();

  fetch(`${SCRIPT_URL}?action=ambilTransaksi`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const pengeluaranData = data.data.filter(item => item.jenis === "pengeluaran");
        renderTabel(pengeluaranData);
      } else {
        pengeluaranTableBody.innerHTML = "<tr><td colspan='3'>Gagal memuat data.</td></tr>";
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      pengeluaranTableBody.innerHTML = "<tr><td colspan='3'>Terjadi kesalahan saat mengambil data.</td></tr>";
    })
    .finally(() => hideLoader());
}

// Tampilkan data ke tabel
function renderTabel(dataPengeluaran) {
  pengeluaranTableBody.innerHTML = "";

  if (dataPengeluaran.length === 0) {
    pengeluaranTableBody.innerHTML = "<tr><td colspan='3'>Belum ada data pengeluaran.</td></tr>";
    return;
  }

  dataPengeluaran.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.kategori}</td>
      <td>Rp ${parseInt(item.jumlah).toLocaleString("id-ID")}</td>
    `;
    pengeluaranTableBody.appendChild(row);
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
