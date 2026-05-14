# SITTA - Sistem Informasi Pemesanan Bahan Ajar Universitas Terbuka
# developed and prompted by Fadel Yulis Pratama - MiniMax M2.5 Free

## Deskripsi Proyek

Aplikasi web berbasis Vue.js untuk sistem kebutuhan proses pemesanan dan distribusi bahan ajar di Universitas Terbuka (UT). Aplikasi ini terdiri dari dua fitur utama: **Stok Bahan Ajar** dan **Tracking DO (Delivery Order)**.

---

## Struktur Proyek

```
/tugas2-vue-ut/
├── index.html              ← Navigasi menu ke 2 halaman
├── stok.html               ← Halaman 1: Stok Bahan Ajar (WAJIB)
├── tracking.html           ← Halaman 2: Tracking DO (WAJIB)
├── css/
│   └── style.css           ← Styling aplikasi
├── js/
│   ├── stok-app.js         ← Logika Vue untuk stok.html
│   ├── tracking-app.js     ← Logika Vue untuk tracking.html
│   ├── dataBahanAjar.js    ← Data dummy bahan ajar
│   ├── data.js             ← Data tambahan
│   └── script.js           ← Logika JavaScript non-Vue
└── assets/
    ├── logo-ut.png
    └── img/                ← Gambar cover bahan ajar
```

---

## Konsep Vue.js yang Diimplementasikan

### 1. Sistem Perorganisasian Kode Vue.js

Proyek ini menerapkan struktur organisasi kode yang rapi dan modular:
- **Pemisahan concerns**: Setiap halaman HTML memiliki file JS terpisah (`stok-app.js`, `tracking-app.js`)
- **Struktur komponen Vue**: Menggunakan pattern `createApp` dengan `data()`, `computed`, `watch`, dan `methods`
- **Konsistensi penamaan**: File, variabel, dan fungsi menggunakan naming convention yang jelas

**Contoh struktur kode Vue di `stok-app.js`:**
```javascript
const { createApp } = Vue;

createApp({
    data() {
        return {
            // State/reactive data
            searchQuery: '',
            selectedKategori: '',
            bahanAjar: [...]
        };
    },
    
    computed: {
        // Property turunan yang otomatis recalculate
        filteredItems() { ... },
        kategoriList() { ... }
    },
    
    watch: {
        // Watching changes
        searchQuery(newVal, oldVal) { ... }
    },
    
    methods: {
        // Fungsi-fungsi yang bisa dipanggil
        formatRupiah(harga) { ... },
        tambahBahanAjar() { ... }
    }
}).mount('#app');
```

---

### 2. Fungsi Menampilkan Data (Directives v-text, v-html, Mustaches)

#### a. **Mustaches `{{ }}`** - Interpolasi Data
Menampilkan data langsung ke dalam template HTML.

**Lokasi: `stok.html:132`**
```html
<td>{{ index + 1 }}</td>
<td><strong>{{ item.kode }}</strong></td>
<td>{{ item.nama }}</td>
<td>{{ item.stok }}</td>
<td>{{ formatRupiah(item.harga) }}</td>
```

**Lokasi: `tracking.html:59-65`**
```html
<h3 v-text="resultData.nama"></h3>
<p>DO: <span v-text="resultData.noDO"></span></p>
```

#### b. **Directive `v-text`** - Menampilkan teks tanpa HTML
Mirip mustache tetapi khusus untuk teks. Berguna saat ingin menghindari XSS.

**Lokasi: `tracking.html:60,61,73,77,81`**
```html
<h3 v-text="resultData.nama"></h3>
<strong v-text="resultData.ekspedisi"></strong>
<strong v-text="resultData.tanggalKirim"></strong>
```

#### c. **Directive `v-model`** - Two-way data binding untuk input
Men.Bindingsikan input pengguna ke data Vue secara dua arah.

**Lokasi: `stok.html:36-41`**
```html
<input 
    type="text" 
    v-model="searchQuery" 
    placeholder="Cari kode atau nama..."
    @input="handleSearch"
>
```

**Lokasi: `stok.html:93`**
```html
<select v-model="formBaru.kategori" required>
```

#### d. **Directive `v-bind`** - One-way data binding
Mengikat attribute HTML ke data Vue (satu arah).

**Lokasi: `stok.html:143-146`**
```html
<span 
    class="status-stok" 
    :class="getStatusClass(item.stok)"
>
    {{ getStatusText(item.stok) }}
</span>
```

**Lokasi: `tracking.html:63`**
```html
<div class="status-badge" :class="getStatusClass(resultData.status)">
```

---

### 3. Fungsi Conditional/Pengandaian (v-if, v-else, v-else-if, v-show)

#### a. **Directive `v-if`** - Render if true (hapus dari DOM jika false)
**Lokasi: `stok.html:73`** - Modal tambah data
```html
<div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
```

**Lokasi: `stok.html:20-22`** - User info jika login
```html
<div class="navbar-user" v-if="isLoggedIn">
    <span>{{ userName }}</span>
</div>
```

**Lokasi: `stok.html:164`** - Detail panel
```html
<div v-if="selectedItem" class="detail-panel">
```

#### b. **Directive `v-else`** - Kondisi alternatif
**Lokasi: `stok.html:153-158`** - Empty state
```html
<tr v-if="filteredItems.length === 0">
    <td colspan="8" class="empty-data">
        <p>Data tidak ditemukan...</p>
    </td>
</tr>
<tr v-else>
    <!-- Data rows -->
</tr>
```

#### c. **Directive `v-show`** - Toggle visibility (tersembunyi tapi ada di DOM)
**Lokasi: `tracking.html:56`** - Hasil tracking
```html
<div v-show="showResult" class="tracking-result">
```

#### d. **Conditional dengan operator dalam Methods**
**Lokasi: `stok-app.js:135-146`**
```javascript
getStatusClass(stok) {
    if (stok <= 50) return 'stok-rendah';
    if (stok <= 100) return 'stok-sedang';
    return 'stok-tinggi';
},

getStatusText(stok) {
    if (stok <= 50) return 'Menipis';
    if (stok <= 100) return 'Cukup';
    return 'Tersedia';
}
```

#### e. **v-if di dalam Computed Property**
**Lokasi: `stok-app.js:64-74`**
```javascript
if (this.selectedKategori !== '') {
    result = result.filter(item => item.kategori === this.selectedKategori);
}
if (this.searchQuery.trim() !== '') {
    const query = this.searchQuery.toLowerCase();
    result = result.filter(item => ...);
}
```

---

### 4. Data Binding & Property (Computed, Methods)

#### a. **One-way Data Binding (`v-bind`)**

**Lokasi: `stok.html:121-125`** - Sortable columns
```html
<th @click="sortBy = 'nama'" class="sortable">
    Kode <span v-if="sortBy === 'nama'">↑</span>
</th>
```

**Lokasi: `tracking.html:63`** - Dynamic class binding
```html
<div class="status-badge" :class="getStatusClass(resultData.status)">
    {{ resultData.status }}
</div>
```

#### b. **Two-way Data Binding (`v-model`)**

**Lokasi: `stok.html:36-40`**
```html
<input type="text" v-model="searchQuery" @input="handleSearch">
```

**Lokasi: `stok.html:46-51`**
```html
<select v-model="selectedKategori" @change="handleFilter">
    <option v-for="kategori in kategoriList" :key="kategori" :value="kategori">
        {{ kategori }}
    </option>
</select>
```

**Lokasi: `tracking.html:35-42`**
```html
<input type="text" v-model="inputDO" @keyup.enter="cariDO">
```

#### c. **Computed Property** - Properti turunan otomatis

**Lokasi: `stok-app.js:43-77`**
```javascript
computed: {
    // Filter dan sorting otomatis saat data berubah
    filteredItems() {
        let result = [...this.bahanAjar];
        
        if (this.selectedKategori !== '') {
            result = result.filter(item => item.kategori === this.selectedKategori);
        }
        
        if (this.searchQuery.trim() !== '') {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(item => 
                item.nama.toLowerCase().includes(query) ||
                item.kode.toLowerCase().includes(query)
            );
        }
        
        // Sorting logic
        if (this.sortBy === 'nama') {
            result.sort((a, b) => a.nama.localeCompare(b.nama));
        } else if (this.sortBy === 'stok') {
            result.sort((a, b) => b.stok - a.stok);
        }
        
        return result;
    },
    
    // Daftar kategori unik
    kategoriList() {
        const kategoris = this.bahanAjar.map(item => item.kategori);
        return [...new Set(kategoris)];
    },
    
    // Total nilai stok
    totalNilaiStok() {
        return this.bahanAjar.reduce((total, item) => 
            total + (item.stok * item.harga), 0
        );
    }
}
```

**Lokasi: `tracking-app.js:80-91`**
```javascript
computed: {
    totalDO() {
        return Object.keys(this.dataDO).length;
    },
    
    doSelesai() {
        return Object.values(this.dataDO)
            .filter(doItem => doItem.status === 'Selesai').length;
    },
    
    doDalamPengiriman() {
        return Object.values(this.dataDO)
            .filter(doItem => doItem.status === 'Dalam Pengiriman').length;
    }
}
```

#### d. **Methods Property** - Fungsi yang bisa dipanggil

**Lokasi: `stok-app.js:128-162`**
```javascript
methods: {
    formatRupiah(harga) {
        return 'Rp ' + harga.toLocaleString('id-ID');
    },
    
    getStatusClass(stok) {
        if (stok <= 50) return 'stok-rendah';
        if (stok <= 100) return 'stok-sedang';
        return 'stok-tinggi';
    },
    
    handleSearch() {
        console.log('Search triggered:', this.searchQuery);
    },
    
    handleFilter() {
        console.log('Filter changed:', this.selectedKategori);
    },
    
    validateForm() {
        this.errors = {};
        if (!this.formBaru.kode || this.formBaru.kode.length < 5) {
            this.errors.kode = 'Kode harus minimal 5 karakter';
        }
        return Object.keys(this.errors).length === 0;
    },
    
    tambahBahanAjar() {
        if (!this.validateForm()) return;
        this.bahanAjar.push({ ...this.formBaru });
        this.showModal = false;
    }
}
```

---

### 5. Watcher (Fungsi Observer)

Watcher berfungsi memantau perubahan data dan merespons dengan logika tertentu.

#### a. **Watcher Sederhana**

**Lokasi: `stok-app.js:99-105`** - Watcher search query
```javascript
watch: {
    searchQuery(newVal, oldVal) {
        this.searchCount++;
        this.lastSearchTime = new Date().toLocaleTimeString();
        console.log(`Pencarian ke-${this.searchCount}: "${newVal}" pada ${this.lastSearchTime}`);
    },
    
    selectedKategori(newVal, oldVal) {
        if (newVal !== oldVal) {
            console.log(`Filter kategori berubah: ${oldVal || 'Semua'} -> ${newVal || 'Semua'}`);
        }
    }
}
```

#### b. **Watcher dengan Deep Option**

**Lokasi: `stok-app.js:114-120`** - Deep watcher untuk array
```javascript
bahanAjar: {
    handler(newVal) {
        console.log(`Data bahan ajar berubah: ${newVal.length} item`);
    },
    deep: true
}
```

#### c. **Watcher di Tracking App**

**Lokasi: `tracking-app.js:94-107`**
```javascript
watch: {
    inputDO(newVal, oldVal) {
        // Watcher 1: Validasi format DO saat input berubah
        if (newVal && newVal.length > 0) {
            this.showError = false;
            console.log('Input DO berubah:', newVal);
        }
    },
    
    riwayatPencarian(newVal, oldVal) {
        // Watcher 2: Monitoring riwayat pencarian
        console.log('Riwayat pencarian diperbarui:', newVal.length, 'item');
    }
}
```

---

### 6. List Rendering (v-for)

**Lokasi: `stok.html:48-51`** - Render kategori options
```html
<option v-for="kategori in kategoriList" :key="kategori" :value="kategori">
    {{ kategori }}
</option>
```

**Lokasi: `stok.html:131`** - Render tabel data
```html
<tr v-for="(item, index) in filteredItems" :key="item.kode">
```

**Lokasi: `tracking.html:92-104`** - Render timeline tracking
```html
<div 
    v-for="(track, index) in resultData.tracking" 
    :key="index"
    class="timeline-item"
    :class="{ 'active': index === 0 }"
>
```

**Lokasi: `tracking.html:113-121`** - Render riwayat pencarian
```html
<div v-for="(item, index) in riwayatPencarian" :key="index" class="riwayat-item">
```

---

### 7. Form Input dan Validasi

#### a. **Form dengan Two-way Binding**

**Lokasi: `stok.html:80-109`**
```html
<form @submit.prevent="tambahBahanAjar">
    <div class="input-group">
        <label>Kode Bahan Ajar</label>
        <input type="text" v-model="formBaru.kode" required placeholder="Contoh: ADPU4431">
        <small v-if="errors.kode" class="error-text">{{ errors.kode }}</small>
    </div>
    <div class="input-group">
        <label>Stok</label>
        <input type="number" v-model.number="formBaru.stok" required min="0">
    </div>
    <button type="submit" class="btn-login">Simpan</button>
</form>
```

#### b. **Validasi Input**

**Lokasi: `stok-app.js:164-177`**
```javascript
validateForm() {
    this.errors = {};
    
    if (!this.formBaru.kode || this.formBaru.kode.length < 5) {
        this.errors.kode = 'Kode harus minimal 5 karakter';
    }
    
    if (!this.formBaru.nama || this.formBaru.nama.length < 3) {
        this.errors.nama = 'Nama harus minimal 3 karakter';
    }
    
    return Object.keys(this.errors).length === 0;
}
```

---

### 8. Event Handling (@ atau v-on)

**Lokasi: `stok.html:39`** - @input event
```html
@input="handleSearch"
```

**Lokasi: `stok.html:46,56`** - @change event
```html
@change="handleFilter"
@change="handleSort"
```

**Lokasi: `stok.html:68`** - @click event
```html
@click="showModal = true"
```

**Lokasi: `tracking.html:39`** - @keyup.enter event
```html
@keyup.enter="cariDO"
```

**Lokasi: `stok.html:80`** - @submit.prevent event
```html
@submit.prevent="tambahBahanAjar"
```

---

## Cara Menjalankan

1. Buka `index.html` di browser (disarankan menggunakan live server atau VS Code Live Server)
2. Klik menu **Stok Bahan Ajar** untuk mengelola stok
3. Klik menu **Tracking DO** untuk melacak pengiriman

---

## Indikator Capaian yang Terpenuhi

| No | Indikator | Status | Lokasi Implementasi |
|----|-----------|--------|---------------------|
| 1 | Sistem perorganisasian kode Vue.js | ✅ | Folder `js/` dengan pemisahan file per fitur |
| 2 | Fungsi menampilkan data (mustaches, v-text, v-html) | ✅ | `stok.html:132`, `tracking.html:60-85` |
| 3 | Fungsi conditional (v-if, v-else, v-show) | ✅ | `stok.html:73,164`, `tracking.html:56` |
| 4 | Data binding (v-bind, v-model) dengan computed & methods | ✅ | `stok-app.js`, `tracking-app.js` |
| 5 | Watcher (minimal 2) | ✅ | `stok-app.js:99-120`, `tracking-app.js:94-107` |
| 6 | Form input dan validasi | ✅ | `stok.html:80-109`, `stok-app.js:164-177` |
| 7 | Kreativitas UI/UX | ✅ | Desain modern dengan warna UT |