const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoggedIn: false,
            userName: 'Mahasiswa',
            
            searchQuery: '',
            selectedKategori: '',
            sortBy: 'nama',
            
            showModal: false,
            selectedItem: null,
            
            formBaru: {
                kode: '',
                nama: '',
                kategori: '',
                stok: 0,
                harga: 0
            },
            errors: {},
            
            // Dummy data dari file yang disediakan
            bahanAjar: [
                { kode: 'ADPU4431', nama: 'Perilaku Organisasi', kategori: 'Manajemen', stok: 150, harga: 45000 },
                { kode: 'ISIP4216', nama: 'Metode Penelitian Sosial', kategori: 'Ilmu Sosial', stok: 85, harga: 52000 },
                { kode: 'MSIM4202', nama: 'Interaksi Manusia dan Komputer', kategori: 'Teknologi Informasi', stok: 120, harga: 48000 },
                { kode: 'PAUD4227', nama: 'Perkembangan Peserta Didik', kategori: 'PAUD', stok: 60, harga: 55000 },
                { kode: 'MSIM4401', nama: 'Kepemimpinan Teknologi', kategori: 'Teknologi Informasi', stok: 90, harga: 60000 },
                { kode: 'ISIP4216', nama: 'Pengantar Komunikasi', kategori: 'Ilmu Komunikasi', stok: 200, harga: 40000 },
                { kode: 'MSIM4101', nama: 'Mikrobiologi', kategori: 'IPA', stok: 45, harga: 75000 },
                { kode: 'MSIM4102', nama: 'Manajemen Keuangan', kategori: 'Manajemen', stok: 110, harga: 58000 }
            ],
            
            // Untuk tracking search history (watcher example)
            lastSearchTime: null,
            searchCount: 0
        };
    },
    
    computed: {
        // Computed property untuk filter dan sorting data
        filteredItems() {
            let result = [...this.bahanAjar];
            
            // Filter berdasarkan kategori (v-if/v-else-if logic)
            if (this.selectedKategori !== '') {
                result = result.filter(item => item.kategori === this.selectedKategori);
            }
            
            // Filter berdasarkan search query (two-way binding dengan v-model)
            if (this.searchQuery.trim() !== '') {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(item => 
                    item.nama.toLowerCase().includes(query) ||
                    item.kode.toLowerCase().includes(query) ||
                    item.kategori.toLowerCase().includes(query)
                );
            }
            
            // Sorting (computed property)
            if (this.sortBy === 'nama') {
                result.sort((a, b) => a.nama.localeCompare(b.nama));
            } else if (this.sortBy === 'namaDesc') {
                result.sort((a, b) => b.nama.localeCompare(a.nama));
            } else if (this.sortBy === 'stok') {
                result.sort((a, b) => b.stok - a.stok);
            } else if (this.sortBy === 'stokLow') {
                result.sort((a, b) => a.stok - b.stok);
            } else if (this.sortBy === 'harga') {
                result.sort((a, b) => a.harga - b.harga);
            }
            
            return result;
        },
        
        // Computed property untuk daftar kategori unik
        kategoriList() {
            const kategoris = this.bahanAjar.map(item => item.kategori);
            return [...new Set(kategoris)];
        },
        
        // Computed property untuk total nilai stok
        totalNilaiStok() {
            return this.bahanAjar.reduce((total, item) => total + (item.stok * item.harga), 0);
        },
        
        // Computed property untuk statistik stok
        statistikStok() {
            const rendah = this.bahanAjar.filter(i => i.stok <= 50).length;
            const sedang = this.bahanAjar.filter(i => i.stok > 50 && i.stok <= 100).length;
            const tinggi = this.bahanAjar.filter(i => i.stok > 100).length;
            return { rendah, sedang, tinggi, total: this.bahanAjar.length };
        }
    },
    
    watch: {
        // Watcher 1: Memantau perubahan search query
        searchQuery(newVal, oldVal) {
            this.searchCount++;
            this.lastSearchTime = new Date().toLocaleTimeString();
            console.log(`Pencarian ke-${this.searchCount}: "${newVal}" pada ${this.lastSearchTime}`);
        },
        
        // Watcher 2: Memantau perubahan kategori yang dipilih
        selectedKategori(newVal, oldVal) {
            if (newVal !== oldVal) {
                console.log(`Filter kategori berubah: ${oldVal || 'Semua'} -> ${newVal || 'Semua'}`);
            }
        },
        
        // Watcher 3: Memantau perubahan data bahan ajar
        bahanAjar: {
            handler(newVal) {
                console.log(`Data bahan ajar berubah: ${newVal.length} item`);
            },
            deep: true
        }
    },
    
    mounted() {
        // Inisialisasi saat komponen mount
        console.log('Stok App mounted - Vue.js initialized');
    },
    
    methods: {
        // Method untuk format rupiah
        formatRupiah(harga) {
            return 'Rp ' + harga.toLocaleString('id-ID');
        },
        
        // Method untuk get status class (conditional rendering)
        getStatusClass(stok) {
            if (stok <= 50) return 'stok-rendah';
            if (stok <= 100) return 'stok-sedang';
            return 'stok-tinggi';
        },
        
        // Method untuk get status text
        getStatusText(stok) {
            if (stok <= 50) return 'Menipis';
            if (stok <= 100) return 'Cukup';
            return 'Tersedia';
        },
        
        // Method handler untuk search
        handleSearch() {
            // Triggered via v-on:input (@input)
            console.log('Search triggered:', this.searchQuery);
        },
        
        // Method handler untuk filter
        handleFilter() {
            console.log('Filter changed:', this.selectedKategori);
        },
        
        // Method handler untuk sort
        handleSort() {
            console.log('Sort changed:', this.sortBy);
        },
        
        // Method untuk validasi form
        validateForm() {
            this.errors = {};
            
            if (!this.formBaru.kode || this.formBaru.kode.length < 5) {
                this.errors.kode = 'Kode harus minimal 5 karakter';
            }
            
            if (!this.formBaru.nama || this.formBaru.nama.length < 3) {
                this.errors.nama = 'Nama harus minimal 3 karakter';
            }
            
            return Object.keys(this.errors).length === 0;
        },
        
        // Method untuk tambah bahan ajar
        tambahBahanAjar() {
            if (!this.validateForm()) {
                return;
            }
            
            // Check duplikasi kode
            const exists = this.bahanAjar.some(item => item.kode === this.formBaru.kode);
            if (exists) {
                this.errors.kode = 'Kode sudah ada!';
                return;
            }
            
            this.bahanAjar.push({ ...this.formBaru });
            
            // Reset form
            this.formBaru = {
                kode: '',
                nama: '',
                kategori: '',
                stok: 0,
                harga: 0
            };
            
            this.showModal = false;
            console.log('Bahan ajar ditambahkan');
        },
        
        // Method untuk edit item
        editItem(item) {
            this.selectedItem = item;
            console.log('Edit item:', item.kode);
        },
        
        // Method untuk hapus item
        hapusItem(kode) {
            const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus ${kode}?`);
            if (confirmDelete) {
                this.bahanAjar = this.bahanAjar.filter(item => item.kode !== kode);
                console.log('Item dihapus:', kode);
            }
        }
    }
}).mount('#app');