const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxL9n0sQfUP4-hvne-_MYZhlHBfA1-8X7hqOm-Gao43gYt8vJXzo7Tr_kWYZYTuLvGd/exec";

const riwayatTableBody = document.getElementById("riwayatTableBody");
let semuaTransaksi = [];

function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "flex";
}
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

fetchDataRiwayat();

function fetchDataRiwayat() {
  showLoader();
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
    })
    .finally(() => hideLoader());
}

function renderTabel(dataTransaksi) {
  riwayatTableBody.innerHTML = "";

  if (dataTransaksi.length === 0) {
    riwayatTableBody.innerHTML = "<tr><td colspan='4'>Tidak ada transaksi.</td></tr>";
    return;
  }

  dataTransaksi.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  dataTransaksi.forEach(item => {
    const row = document.createElement("tr");
    const tglFormatted = new Date(item.tanggal).toLocaleDateString("id-ID");
    row.innerHTML = `
      <td>${tglFormatted}</td>
      <td>${item.jenis === "pemasukan" ? "Pemasukan" : "Pengeluaran"}</td>
      <td>${item.kategori}</td>
      <td>Rp ${parseInt(item.jumlah).toLocaleString("id-ID")}</td>
    `;
    riwayatTableBody.appendChild(row);
  });
}

document.getElementById("filterForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const tanggalInputRaw = document.getElementById("filterTanggal").value.trim();
  const kategoriInput = document.getElementById("filterKategori").value.toLowerCase().trim();

  let formattedTanggal = "";
  if (tanggalInputRaw) {
    const tanggalInput = new Date(tanggalInputRaw);
    if (!isNaN(tanggalInput)) {
      formattedTanggal = tanggalInput.toISOString().split("T")[0];
    }
  }

  const hasilFilter = semuaTransaksi.filter(item => {
    const tanggalItem = new Date(item.tanggal).toISOString().split("T")[0];
    const cocokTanggal = formattedTanggal ? tanggalItem === formattedTanggal : true;
    const cocokKategori = kategoriInput ? item.kategori.toLowerCase().includes(kategoriInput) : true;
    return cocokTanggal && cocokKategori;
  });

  renderTabel(hasilFilter);
});

document.getElementById("resetFilter").addEventListener("click", () => {
  document.getElementById("filterForm").reset();
  renderTabel(semuaTransaksi);
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('active');
}
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

document.getElementById("download-pdf").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const now = new Date();
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();

 const bulanDipilih = parseInt(document.getElementById("bulanSelect").value);
const tahunDipilih = parseInt(document.getElementById("tahunSelect").value);
const bulanNama = new Date(tahunDipilih, bulanDipilih - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' });


  // Filter transaksi bulan & tahun yang dipilih
  const dataBulanIni = semuaTransaksi.filter(item => {
    const [yyyy, mm] = item.tanggal.split("-");
    return Number(mm) === bulanDipilih && Number(yyyy) === tahunDipilih;
  });

  let saldo = 0;
  let totalPengeluaran = 0;
  const hariPengeluaranSet = new Set();

  dataBulanIni.forEach(item => {
    const jumlah = Number(item.jumlah);
    if (item.jenis === "pemasukan") {
      saldo += jumlah;
    } else {
      saldo -= jumlah;
      totalPengeluaran += jumlah;
      hariPengeluaranSet.add(item.tanggal); // simpan tanggal unik pengeluaran
    }
  });

  const rataRata = hariPengeluaranSet.size > 0
    ? Math.round(totalPengeluaran / hariPengeluaranSet.size)
    : 0;

  doc.setFontSize(16);
  doc.text(`Rekapan Keuangan - ${bulanNama}`, 14, 20);
  doc.setFontSize(12);
  doc.text(`Sisa Saldo: Rp ${saldo.toLocaleString("id-ID")}`, 14, 30);
  doc.text(`Total Pengeluaran Bulan Ini: Rp ${totalPengeluaran.toLocaleString("id-ID")}`, 14, 38);
  doc.text(`Rata-rata Pengeluaran Harian: Rp ${rataRata.toLocaleString("id-ID")}`, 14, 46);

  const rows = dataBulanIni.map((item, index) => [
    index + 1,
    item.tanggal,
    item.kategori,
    item.jenis,
    `Rp ${Number(item.jumlah).toLocaleString("id-ID")}`
  ]);

  doc.autoTable({
    startY: 54,
    head: [['No', 'Tanggal', 'Kategori', 'Jenis', 'Jumlah']],
    body: rows
  });

  doc.save(`Rekapan_${bulanNama}.pdf`);
});

// 🎯 Isi dropdown tahun mulai dari 2025 sampai 10 tahun ke depan
(function isiDropdownTahun() {
  const tahunSelect = document.getElementById("tahunSelect");
  const tahunMulai = 2025; // tahun minimum
  const tahunAkhir = new Date().getFullYear() + 10;

  for (let i = tahunMulai; i <= tahunAkhir; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    if (i === new Date().getFullYear()) opt.selected = true;
    tahunSelect.appendChild(opt);
  }
})();
