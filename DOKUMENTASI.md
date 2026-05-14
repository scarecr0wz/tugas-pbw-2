# Dokumentasi Project SITTA - Vue.js
# prompted and developed by Fadel Yulis Pratama

## 📁 Struktur Proyek

```
sitta-praktik-tugas-2/
├── index.html              # Halaman utama (menu navigasi)
├── stok.html               # Halaman Stok Bahan Ajar (Vue.js)
├── tracking.html           # Halaman Tracking DO (Vue.js)
├── css/
│   └── style.css           # Styling CSS (semua halaman)
├── js/
│   ├── stok-app.js        # Logika Vue.js untuk stok.html
│   └── tracking-app.js    # Logika Vue.js untuk tracking.html
└── assets/
    └── logo-ut.png        # Logo Universitas Terbuka
```

---

## 🚀 Cara Menjalankan

**Tidak perlu Node.js!** Cukup buka file HTML langsung di browser:

1. Buka `index.html` → klik menu "Stok Bahan Ajar" atau "Tracking DO"
2. Atau langsung buka `stok.html` atau `tracking.html`

---

## 📖 Penjelasan Setiap Halaman

### 1. index.html (Menu Navigasi)
Halaman utama tanpa login. Berisi 2 menu:
- **Stok Bahan Ajar** → ke `stok.html`
- **Tracking DO** → ke `tracking.html`

---

### 2. stok.html (Stok Bahan Ajar)

#### Fitur yang tersedia:
1. **Pencarian** - ketik kode/nama bahan ajar
2. **Filter Kategori** - pilih kategori dropdown
3. **Sorting** - klik header tabel untuk urutkan
4. **Tambah Data** - klik tombol "+ Tambah Bahan Ajar"
5. **Edit/Hapus** - tombol aksi per baris
6. **Detail View** - klik "Edit" untuk lihat detail

#### Komponen Vue yang digunakan:

| Directive/Feature | Contoh Penggunaan | Keterangan |
|------------------|------------------|-------------|
| `v-model` | `<input v-model="searchQuery">` | Two-way binding |
| `v-for` | `<option v-for="kategori in kategoriList">` | List rendering |
| `v-if/v-else` | `<tr v-if="filteredItems.length === 0">` | Conditional |
| `v-show` | - | Toggle visibility |
| `:class` | `:class="getStatusClass(item.stok)"` | Dynamic class |
| `@click` | `@click="tambahBahanAjar"` | Event handler |
| `@input` | `@input="handleSearch"` | Input event |
| `@change` | `@change="handleFilter"` | Change event |
| `{{ }}` | `{{ formatRupiah(item.harga) }}` | Mustaches |

#### Computed Properties (stok-app.js):
```javascript
filteredItems     // Filter + sorting data
kategoriList     // Daftar kategori unik
totalNilaiStok    // Total nilai seluruh stok
statistikStok     // Statistik: rendah/sedang/tinggi
```

#### Methods (stok-app.js):
```javascript
formatRupiah()    // Format angka ke Rupiah
getStatusClass()  // Get CSS class berdasarkan stok
getStatusText()   // Get teks status
handleSearch()    // Handler saat mencari
handleFilter()    // Handler saat filter berubah
handleSort()      // Handler saat sorting
tambahBahanAjar() // Tambah data baru
editItem()        // Edit item
hapusItem()       // Hapus item
validateForm()    // Validasi form input
```

#### Watchers (stok-app.js):
```javascript
watch: {
    searchQuery(newVal) { 
        // Monitoring perubahan search
    },
    selectedKategori(newVal) { 
        // Monitoring perubahan filter 
    },
    bahanAjar: { handler() { 
        // Deep watcher - monitoring perubahan data 
    }, deep: true }
}
```

---

### 3. tracking.html (Tracking DO)

#### Fitur yang tersedia:
1. **Pencarian DO** - input nomor DO, tekan Enter atau klik Cari
2. **Loading State** - spinner saat mencari
3. **Timeline** - visualize status pengiriman
4. **Riwayat** - klik riwayat untuk cari ulang
5. **Stats Panel** - statistik DO

#### Contoh Nomor DO yang bisa dicoba:
- `DO2023001234`
- `DO2023005678`
- `DO2023009012`

#### Komponen Vue yang digunakan:
Sama seperti stok.html, plus:
- `@keyup.enter` - trigger cari saat tekan Enter
- `v-show` - toggle hasil tracking

#### Computed Properties (tracking-app.js):
```javascript
totalDO           // Total DO tersedia
doSelesai        // Jumlah DO berstatus Selesai
doDalamPengiriman // Jumlah DO berstatus Dalam Pengiriman
```

#### Methods (tracking-app.js):
```javascript
formatRupiah()    // Format Rupiah
getStatusClass()  // Get CSS class status
cariDO()         // Cari data DO (dengan loading)
cariUlang()      // Cari dari riwayat
```

#### Watchers (tracking-app.js):
```javascript
watch: {
    inputDO(newVal) { 
        // Validasi format DO 
    },
    riwayatPencarian(newVal) { 
        // Monitoring riwayat 
    }
}
```

---

## 🔍 Penjelasan Fitur Vue per Indikator

### Indikator 1: Struktur Vue.js
- Menggunakan Vue 3 CDN (`https://unpkg.com/vue@3/dist/vue.global.js`)
- Satu instance Vue per halaman
- File JS terpisah untuk setiap halaman

### Indikator 2: Menampilkan Data (Mustaches/Directive)
```html
<!-- Mustaches -->
<h3>{{ resultData.nama }}</h3>

<!-- v-text -->
<h3 v-text="resultData.nama"></h3>

<!-- v-html (tidak digunakan di project ini) -->
```

### Indikator 3: Conditional (v-if/v-else/v-show)
```html
<!-- v-if/v-else -->
<tr v-if="filteredItems.length === 0">
    <td>Data tidak ditemukan</td>
</tr>
<tr v-else>
    <!-- data ada -->
</tr>

<!-- v-show -->
<div v-show="showResult" class="tracking-result">
```

### Indikator 4: Data Binding

**One-way (v-bind):**
```html
:class="getStatusClass(item.stok)"
:src="imageSrc"
:value="someValue"
```

**Two-way (v-model):**
```html
<input v-model="searchQuery">
<select v-model="selectedKategori">
<textarea v-model="formBaru.keterangan">
```

### Indikator 5: Computed Property
```javascript
computed: {
    filteredItems() {
        // Logika filter + sort
        // Otomatis recalculate saat dependency berubah
        return this.bahanAjar.filter(...)
    }
}
```

### Indikator 6: Methods
```javascript
methods: {
    formatRupiah(harga) {
        return 'Rp ' + harga.toLocaleString('id-ID');
    }
}
```

### Indikator 7: Watchers
```javascript
watch: {
    // Simple watcher
    searchQuery(newVal, oldVal) {
        console.log('Search berubah:', newVal);
    },
    
    // Deep watcher
    bahanAjar: {
        handler(newVal) {
            console.log('Data berubah');
        },
        deep: true
    }
}
```

---

## 📝 Cara Penggunaan Setiap Halaman

### Stok.html
1. **Cari**: Ketik di input search → otomatis filter
2. **Filter**: Pilih kategori → data difilter
3. **Sort**: Klik header tabel (Kode/Nama/Stok/Harga)
4. **Tambah**: Klik "+ Tambah Bahan Ajar" → isi form → Simpan
5. **Edit**: Klik "Edit" → muncul detail panel
6. **Hapus**: Klik "Hapus" → konfirmasi → data dihapus

### Tracking.html
1. **Cari DO**: Ketik nomor DO → Enter atau klik Cari
2. **Contoh DO**: 
   - `DO2023001234` → Selesai
   - `DO2023005678` → Dalam Pengiriman
   - `DO2023009012` → Selesai
3. **Riwayat**: Klik item di riwayat untuk cari ulang
4. **Stats**: Lihat total DO, selesai, dan dikirim

---

## ⚠️ Catatan Penting

1. **Data tidak persist** - Data akan reset saat refresh browser (karena tanpa backend)
2. **Validasi sederhana** - Validasi form hanya client-side
3. **Dummy data** - Data DO sudah dihardcode di `tracking-app.js`

---

## ✅ Checklist Semua Indikator

| No | Indikator | Status |
|----|-----------|--------|
| 1 | Struktur Vue.js (folder, file, komponen) | ✅ |
| 2 | Mustaches & v-text | ✅ |
| 3 | v-if, v-else, v-else-if, v-show | ✅ |
| 4 | v-bind, v-model | ✅ |
| 5 | Computed Property | ✅ |
| 6 | Methods | ✅ |
| 7 | Watchers (min 2) | ✅ |
| 8 | Form input & validasi | ✅ |
| 9 | List Rendering (v-for) | ✅ |
| 10 | Event handling (@click, @input, @change) | ✅ |

---

## 🎯 Tips untuk Presentasi

Saat presentasi, jelaskan:
1. **Struktur folder** - tunjukkan via file explorer
2. **Demo langsung** - buka browser, klik-klik menu
3. **Code explanation** - tunjukkan kode penting:
   - `v-model` di input search
   - `v-for` di tabel
   - `computed` untuk filter
   - `watch` untuk monitoring
4. **Jawab pertanyaan** tentang为什么 pakai Vue.js (reactive, component-based, etc.)