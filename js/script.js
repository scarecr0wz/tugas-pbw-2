
// Login Page
const modalLupa = document.getElementById("modalLupa");
const modalDaftar = document.getElementById("modalDaftar");
const modalAlert = document.getElementById("modalAlert");

if (modalLupa && modalDaftar && modalAlert) {
    const btnLupa = document.getElementById("forgotPasswordLink");
    const btnDaftar = document.getElementById("registerLink");
    const spanLupa = document.getElementById("closeLupa");
    const spanDaftar = document.getElementById("closeDaftar");
    const spanAlert = document.getElementById("closeAlert");
    const btnAlertOk = document.getElementById("btnAlertOk");

    function tampilkanPopup(judul, pesan, tipe) {
        document.getElementById("alertTitle").textContent = judul;
        document.getElementById("alertMessage").textContent = pesan;
        const header = document.querySelector(".alert-header");
        header.className = "modal-header alert-header " + tipe;
        modalAlert.style.display = "flex";
    }

    function tutupAlert() {
        modalAlert.style.display = "none";
    }

    spanAlert.onclick = tutupAlert;
    btnAlertOk.onclick = tutupAlert;

    btnLupa.onclick = function (e) {
        e.preventDefault();
        modalLupa.style.display = "flex";
    }

    btnDaftar.onclick = function (e) {
        e.preventDefault();
        modalDaftar.style.display = "flex";
    }

    spanLupa.onclick = function () {
        modalLupa.style.display = "none";
    }

    spanDaftar.onclick = function () {
        modalDaftar.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modalLupa) {
            modalLupa.style.display = "none";
        }
        if (event.target == modalDaftar) {
            modalDaftar.style.display = "none";
        }
        if (event.target == modalAlert) {
            tutupAlert();
        }
    }

    document.getElementById("formLupaPassword").onsubmit = function (e) {
        e.preventDefault();
        const email = document.getElementById("emailLupa").value;
        if (email) {
            tampilkanPopup("Berhasil", "Instruksi pemulihan password telah dikirim ke " + email, "success");
            modalLupa.style.display = "none";
            document.getElementById("emailLupa").value = "";
        }
    }

    document.getElementById("formDaftar").onsubmit = function (e) {
        e.preventDefault();
        const nim = document.getElementById("nimDaftar").value;
        const email = document.getElementById("emailDaftar").value;
        const password = document.getElementById("passwordDaftar").value;
        if (nim && email && password) {
            tampilkanPopup("Pendaftaran Berhasil", "NIM: " + nim + ". Silakan tunggu verifikasi dari petugas UT-Daerah.", "success");
            modalDaftar.style.display = "none";
            document.getElementById("nimDaftar").value = "";
            document.getElementById("emailDaftar").value = "";
            document.getElementById("passwordDaftar").value = "";
        }
    }

    document.getElementById("loginForm").onsubmit = function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const penggunaDitemukan = dataPengguna.find(function (user) {
            return user.email === email && user.password === password;
        });
        if (penggunaDitemukan) {
            sessionStorage.setItem("userData", JSON.stringify(penggunaDitemukan));
            tampilkanPopup("Login Berhasil", "Selamat datang, " + penggunaDitemukan.nama + "!", "success");
            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 1500);
        } else {
            tampilkanPopup("Login Gagal", "Email atau password yang Anda masukkan salah!", "error");
        }
    }
}

// Dashboard
const userData = JSON.parse(sessionStorage.getItem("userData"));

if (userData && document.querySelector(".dashboard-page")) {
    document.getElementById("userName").textContent = userData.nama;
    document.getElementById("userRole").textContent = userData.role;
    document.getElementById("userAvatar").textContent = userData.nama.charAt(0).toUpperCase();

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) {
            return { greeting: "Selamat Pagi", icon: "🌅", subtext: "Semoga hari Anda produktif!" };
        } else if (hour >= 11 && hour < 15) {
            return { greeting: "Selamat Siang", icon: "☀️", subtext: "Jangan lupa istirahat makan siang!" };
        } else if (hour >= 15 && hour < 18) {
            return { greeting: "Selamat Sore", icon: "🌇", subtext: "Selamat melanjutkan aktivitas!" };
        } else {
            return { greeting: "Selamat Malam", icon: "🌙", subtext: "Waktunya beristirahat!" };
        }
    }

    const greeting = getGreeting();
    document.getElementById("greetingText").textContent = greeting.greeting + ", " + userData.nama + "!";
    document.getElementById("greetingSubtext").textContent = greeting.subtext;
    document.getElementById("greetingIcon").textContent = greeting.icon;

    function showPage(page) {
        const dynamicSection = document.getElementById("dynamic-content");
        const pageTitle = document.getElementById("pageTitle");
        const pageContent = document.getElementById("pageContent");

        dynamicSection.style.display = "block";

        if (page === 'monitoring') {
            pageTitle.textContent = "Monitoring Progress DO";
            pageContent.innerHTML = `
                <div class="info-box">
                    <p>Menampilkan status pengiriman bahan ajar yang sedang diproses.</p>
                    <table class="simple-table" style="width:100%; border-collapse: collapse; margin-top: 15px;">
                        <tr style="background: #f8f9fa; text-align: left;">
                            <th style="padding: 10px; border-bottom: 1px solid #eee;">Nomor DO</th>
                            <th style="padding: 10px; border-bottom: 1px solid #eee;">Status</th>
                            <th style="padding: 10px; border-bottom: 1px solid #eee;">Estimasi</th>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">DO-2026-001</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="color: #00468b;">Diproses</span></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">2 Hari</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">DO-2026-002</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="color: #28a745;">Dikirim</span></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">Tiba Besok</td>
                        </tr>
                    </table>
                </div>
            `;
        } else if (page === 'stok') {
            pageTitle.textContent = "Informasi Stok Bahan Ajar";
            pageContent.innerHTML = `
                <div class="stok-container">
                    <!-- Form Tambah Stok -->
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #eee;">
                        <h4 style="margin: 0 0 15px 0; color: #00468b;">Tambah Stok Baru</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                            <input type="text" id="newKode" placeholder="Kode Barang" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                            <input type="text" id="newNama" placeholder="Nama Barang" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                            <input type="text" id="newJenis" placeholder="Jenis" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                            <input type="number" id="newStok" placeholder="Jumlah Stok" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                            <button onclick="tambahStok()" style="background: #00468b; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold;">Tambah</button>
                        </div>
                    </div>

                    <!-- Tabel Stok -->
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;" id="tableStok">
                            <thead>
                                <tr style="background: #00468b; color: white; text-align: left;">
                                    <th style="padding: 12px; border: 1px solid #eee;">Cover</th>
                                    <th style="padding: 12px; border: 1px solid #eee;">Kode</th>
                                    <th style="padding: 12px; border: 1px solid #eee;">Nama Barang</th>
                                    <th style="padding: 12px; border: 1px solid #eee;">Jenis</th>
                                    <th style="padding: 12px; border: 1px solid #eee;">Stok</th>
                                    <th style="padding: 12px; border: 1px solid #eee;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="stokBody">
                                <!-- Data will be injected here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            renderStokTable();
        } else if (page === 'tracking') {
            pageTitle.textContent = "Tracking Pengiriman";
            pageContent.innerHTML = `
                <div class="search-container" style="margin-bottom: 30px;">
                    <p style="margin-top: 0; color: #666; font-size: 0.9rem;">Masukkan Nomor Delivery Order (DO) untuk melacak pengiriman.</p>
                    <div class="search-box" style="display: flex; gap: 10px;">
                        <input type="text" id="inputDO" placeholder="Contoh: 2023001234" style="flex: 1; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; outline: none; font-size: 1rem;">
                        <button onclick="cariDO()" style="background: #00468b; color: white; border: none; padding: 0 25px; border-radius: 8px; cursor: pointer; font-weight: 600;">Cari</button>
                    </div>
                    <p id="searchError" style="color: #d9534f; font-size: 0.85rem; margin-top: 10px; display: none;">Nomor DO tidak ditemukan.</p>
                </div>
                <div id="trackingResult" style="display: none; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
                    <div style="background: #f8f9fa; padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong id="resNama" style="display: block; color: #00468b;"></strong>
                            <small id="resDO" style="color: #888;"></small>
                        </div>
                        <span id="resStatusBadge" style="background: #ffcc00; color: #00468b; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold;"></span>
                    </div>
                    <div style="padding: 20px;">
                        <div style="grid-template-columns: 1fr 1fr; display: grid; gap: 15px; margin-bottom: 20px;">
                            <div><small style="color:#888">Ekspedisi</small><div id="resEkspedisi" style="font-weight:600"></div></div>
                            <div><small style="color:#888">Tgl Kirim</small><div id="resTglKirim" style="font-weight:600"></div></div>
                            <div><small style="color:#888">Paket</small><div id="resPaket" style="font-weight:600"></div></div>
                            <div><small style="color:#888">Total</small><div id="resTotal" style="font-weight:600"></div></div>
                        </div>
                        <h4 style="margin: 0 0 15px 0; font-size: 0.9rem; color: #00468b;">Detail Perjalanan</h4>
                        <div id="resTimeline" style="border-left: 2px solid #eee; padding-left: 15px; position: relative;"></div>
                    </div>
                </div>
                <style>
                    .timeline-item { position: relative; padding-bottom: 15px; }
                    .timeline-dot { position: absolute; left: -21px; top: 4px; width: 10px; height: 10px; background: #00468b; border-radius: 50%; }
                    .timeline-time { font-size: 0.7rem; color: #888; }
                    .timeline-desc { font-size: 0.85rem; color: #333; }
                </style>
            `;
        } else if (page === 'rekap') {
            pageTitle.textContent = "Rekap Bahan Ajar";
            pageContent.innerHTML = `
                <div class="info-box">
                    <p>Ringkasan stok bahan ajar per kategori.</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div style="background: #eef2f7; padding: 15px; border-radius: 8px;">
                            <h4 style="margin:0">Total Judul</h4>
                            <p style="font-size: 1.5rem; font-weight: bold; margin: 5px 0;">${dataBahanAjar.length}</p>
                        </div>
                        <div style="background: #eef2f7; padding: 15px; border-radius: 8px;">
                            <h4 style="margin:0">Total Stok</h4>
                            <p style="font-size: 1.5rem; font-weight: bold; margin: 5px 0;">1,581</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (page === 'histori') {
            pageTitle.textContent = "Histori Transaksi";
            pageContent.innerHTML = `
                <div class="info-box">
                    <p>Riwayat transaksi bahan ajar terakhir.</p>
                    <ul style="list-style: none; padding: 0; margin-top: 15px;">
                        <li style="padding: 12px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                            <span>Pengiriman ke UPBJJ Jakarta</span>
                            <span style="color: #888;">28 April 2026</span>
                        </li>
                        <li style="padding: 12px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                            <span>Penerimaan dari Gudang Pusat</span>
                            <span style="color: #888;">25 April 2026</span>
                        </li>
                    </ul>
                </div>
            `;
        }

        window.scrollTo({
            top: dynamicSection.offsetTop - 100,
            behavior: 'smooth'
        });
    }

    function closePage() {
        document.getElementById("dynamic-content").style.display = "none";
    }

    window.showPage = showPage;
    window.closePage = closePage;

} else if (!userData && document.querySelector(".dashboard-page")) {
    window.location.href = "index.html";
}

// Tracking
function cariDO() {
    const input = document.getElementById("inputDO").value.trim();
    const errorMsg = document.getElementById("searchError");
    const resultArea = document.getElementById("trackingResult");

    if (!input) return;

    const data = dataTracking[input];

    if (data) {
        errorMsg.style.display = "none";
        resultArea.style.display = "block";

        document.getElementById("resNama").textContent = data.nama;
        document.getElementById("resDO").textContent = "DO: #" + data.nomorDO;
        document.getElementById("resStatusBadge").textContent = data.status.toUpperCase();
        document.getElementById("resEkspedisi").textContent = data.ekspedisi;
        document.getElementById("resTglKirim").textContent = data.tanggalKirim;
        document.getElementById("resPaket").textContent = data.paket;
        document.getElementById("resTotal").textContent = data.total;

        const timeline = document.getElementById("resTimeline");
        if (data.perjalanan && data.perjalanan.length > 0) {
            timeline.innerHTML = data.perjalanan.map(item => `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-time">${item.waktu}</div>
                    <div class="timeline-desc">${item.keterangan}</div>
                </div>
            `).join("");
        } else {
            timeline.innerHTML = "<p style='color:#888;'>Belum ada detail perjalanan.</p>";
        }

        resultArea.scrollIntoView({ behavior: 'smooth' });
    } else {
        errorMsg.style.display = "block";
        resultArea.style.display = "none";
    }
}
window.cariDO = cariDO;

function renderStokTable() {
    const tbody = document.getElementById("stokBody");
    if (!tbody) return;

    tbody.innerHTML = dataBahanAjar.map((item, index) => `
        <tr style="background: ${index % 2 === 0 ? '#fff' : '#fcfcfc'}">
            <td style="padding: 5px; border: 1px solid #eee; text-align: center;">
                ${item.cover ? `<img src="${item.cover}" alt="Cover" style="height: 60px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">` : '<div style="height: 60px; width: 45px; background: #eee; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: #aaa;">No Cover</div>'}
            </td>
            <td style="padding: 12px; border: 1px solid #eee;">${item.kodeBarang}</td>
            <td style="padding: 12px; border: 1px solid #eee; font-weight: 500;">${item.namaBarang}</td>
            <td style="padding: 12px; border: 1px solid #eee;">${item.jenisBarang}</td>
            <td style="padding: 12px; border: 1px solid #eee; color: ${item.stok < 200 ? '#d9534f' : '#28a745'}; font-weight: bold;">${item.stok}</td>
            <td style="padding: 12px; border: 1px solid #eee;">
                <button onclick="hapusStok(${index})" style="background: none; border: none; color: #d9534f; cursor: pointer; padding: 0;">Hapus</button>
            </td>
        </tr>
    `).join("");
}
function tambahStok() {
    const kode = document.getElementById("newKode").value;
    const nama = document.getElementById("newNama").value;
    const jenis = document.getElementById("newJenis").value;
    const stok = document.getElementById("newStok").value;

    if (!kode || !nama || !jenis || !stok) {
        alert("Semua field harus diisi!");
        return;
    }

    const newItem = {
        kodeBarang: kode,
        namaBarang: nama,
        jenisBarang: jenis,
        stok: parseInt(stok),
        kodeLokasi: "PUSAT",
        edisi: "1",
        cover: ""
    };

    dataBahanAjar.unshift(newItem);
    renderStokTable();

    document.getElementById("newKode").value = "";
    document.getElementById("newNama").value = "";
    document.getElementById("newJenis").value = "";
    document.getElementById("newStok").value = "";
}

function hapusStok(index) {
    if (confirm("Hapus data ini?")) {
        dataBahanAjar.splice(index, 1);
        renderStokTable();
    }
}

window.tambahStok = tambahStok;
window.hapusStok = hapusStok;
window.renderStokTable = renderStokTable;

