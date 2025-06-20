// Ganti URL ini dengan URL Web App kamu yang sudah di-deploy
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxL9n0sQfUP4-hvne-_MYZhlHBfA1-8X7hqOm-Gao43gYt8vJXzo7Tr_kWYZYTuLvGd/exec";

// Ambil referensi elemen
const pemasukanForm = document.getElementById("pemasukanForm");
const pemasukanTableBody = document.getElementById("pemasukanTableBody");

// Fungsi loader
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "flex";
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

// Saat halaman dimuat, ambil data dari spreadsheet
fetchDataPemasukan();

// Event: Simpan data saat form disubmit
pemasukanForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const tanggal = document.getElementById("tanggal").value;
  const sumber = document.getElementById("sumber").value.trim();
  const jumlah = parseInt(document.getElementById("jumlah").value);

  if (!tanggal || !sumber || isNaN(jumlah)) {
    alert("Harap lengkapi semua field.");
    return;
  }

  showLoader(); // Tampilkan loader saat kirim data

  const url = `${SCRIPT_URL}?action=simpanTransaksi&tanggal=${encodeURIComponent(tanggal)}&jenis=pemasukan&kategori=${encodeURIComponent(sumber)}&jumlah=${encodeURIComponent(jumlah)}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Data pemasukan berhasil disimpan!");
        pemasukanForm.reset();
        fetchDataPemasukan(); // Refresh tabel
      } else {
        alert("Gagal menyimpan data.");
        hideLoader(); // Pastikan loader ditutup jika gagal
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Terjadi kesalahan saat mengirim data.");
      hideLoader();
    });
});

// Ambil data dari spreadsheet
function fetchDataPemasukan() {
  showLoader(); // Tampilkan spinner saat ambil data

  fetch(`${SCRIPT_URL}?action=ambilTransaksi`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const pemasukanData = data.data.filter(item => item.jenis === "pemasukan");
        renderTabel(pemasukanData);
      } else {
        pemasukanTableBody.innerHTML = "<tr><td colspan='3'>Gagal memuat data.</td></tr>";
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      pemasukanTableBody.innerHTML = "<tr><td colspan='3'>Terjadi kesalahan saat mengambil data.</td></tr>";
    })
    .finally(() => hideLoader()); // Tutup spinner apapun hasilnya
}

// Tampilkan data ke tabel
function renderTabel(dataPemasukan) {
  pemasukanTableBody.innerHTML = "";

  if (dataPemasukan.length === 0) {
    pemasukanTableBody.innerHTML = "<tr><td colspan='3'>Belum ada data pemasukan.</td></tr>";
    return;
  }

  dataPemasukan.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.kategori}</td>
      <td>Rp ${parseInt(item.jumlah).toLocaleString("id-ID")}</td>
    `;
    pemasukanTableBody.appendChild(row);
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
