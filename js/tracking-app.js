const { createApp } = Vue;

createApp({
    data() {
        return {
            inputDO: '',
            showError: false,
            isLoading: false,
            showResult: false,
            riwayatPencarian: [],
            
            // Data dummy DO
            dataDO: {
                'DO2023001234': {
                    noDO: 'DO2023001234',
                    nama: 'Ahmad Fauzi',
                    ekspedisi: 'JNE Express',
                    tanggalKirim: '15 Januari 2024',
                    jenisPaket: 'Paket Reguler',
                    total: 85000,
                    status: 'Selesai',
                    tracking: [
                        { waktu: '20 Jan 2024 14:30', lokasi: 'Jakarta Selatan', status: 'Paket diterima' },
                        { waktu: '19 Jan 2024 08:15', lokasi: 'Bandung', status: 'Dalam pengiriman' },
                        { waktu: '18 Jan 2024 16:45', lokasi: 'Bandung', status: 'Paket keluar dari gudang' },
                        { waktu: '17 Jan 2024 10:00', lokasi: 'Jakarta', status: 'Paket masuk gudang' },
                        { waktu: '16 Jan 2024 09:30', lokasi: 'Jakarta', status: 'Paket picked up' },
                        { waktu: '15 Jan 2024 14:00', lokasi: 'Jakarta', status: 'Paket dibuat' }
                    ]
                },
                'DO2023005678': {
                    noDO: 'DO2023005678',
                    nama: 'Siti Aminah',
                    ekspedisi: 'Pos Indonesia',
                    tanggalKirim: '18 Januari 2024',
                    jenisPaket: 'Paket Kilat',
                    total: 120000,
                    status: 'Dalam Pengiriman',
                    tracking: [
                        { waktu: '20 Jan 2024 10:00', lokasi: 'Surabaya', status: 'Dalam pengiriman ke tujuan' },
                        { waktu: '19 Jan 2024 15:30', lokasi: 'Surabaya', status: 'Paket tiba disortir Surabaya' },
                        { waktu: '18 Jan 2024 20:00', lokasi: 'Jakarta', status: 'Paket dikirim dari Jakarta' },
                        { waktu: '18 Jan 2024 09:00', lokasi: 'Jakarta', status: 'Paket masuk gudang' },
                        { waktu: '17 Jan 2024 11:00', lokasi: 'Jakarta', status: 'Paket picked up' },
                        { waktu: '16 Jan 2024 16:00', lokasi: 'Jakarta', status: 'Paket dibuat' }
                    ]
                },
                'DO2023009012': {
                    noDO: 'DO2023009012',
                    nama: 'Budi Santoso',
                    ekspedisi: 'TIKI',
                    tanggalKirim: '10 Januari 2024',
                    jenisPaket: 'Paket Halal',
                    total: 95000,
                    status: 'Selesai',
                    tracking: [
                        { waktu: '14 Jan 2024 11:00', lokasi: 'Yogyakarta', status: 'Paket diterima' },
                        { waktu: '13 Jan 2024 09:30', lokasi: 'Yogyakarta', status: 'Dalam pengiriman' },
                        { waktu: '12 Jan 2024 18:00', lokasi: 'Semarang', status: 'Paket transit' },
                        { waktu: '11 Jan 2024 14:00', lokasi: 'Jakarta', status: 'Paket dikirim' },
                        { waktu: '10 Jan 2024 10:00', lokasi: 'Jakarta', status: 'Paket picked up' },
                        { waktu: '09 Jan 2024 17:00', lokasi: 'Jakarta', status: 'Paket dibuat' }
                    ]
                }
            },
            
            resultData: {
                noDO: '',
                nama: '',
                ekspedisi: '',
                tanggalKirim: '',
                jenisPaket: '',
                total: 0,
                status: '',
                tracking: []
            }
        };
    },
    
    computed: {
        totalDO() {
            return Object.keys(this.dataDO).length;
        },
        
        doSelesai() {
            return Object.values(this.dataDO).filter(doItem => doItem.status === 'Selesai').length;
        },
        
        doDalamPengiriman() {
            return Object.values(this.dataDO).filter(doItem => doItem.status === 'Dalam Pengiriman').length;
        }
    },
    
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
    },
    
    methods: {
        formatRupiah(harga) {
            return 'Rp ' + harga.toLocaleString('id-ID');
        },
        
        getStatusClass(status) {
            if (status === 'Selesai') return 'status-selesai';
            if (status === 'Dalam Pengiriman') return 'status-kirim';
            return 'status-default';
        },
        
        cariDO() {
            if (!this.inputDO.trim()) {
                this.showError = true;
                return;
            }
            
            this.isLoading = true;
            this.showResult = false;
            
            // Simulasi loading
            setTimeout(() => {
                const data = this.dataDO[this.inputDO.toUpperCase()];
                
                if (data) {
                    this.resultData = { ...data };
                    this.showResult = true;
                    this.showError = false;
                    
                    // Tambah ke riwayat
                    if (!this.riwayatPencarian.includes(this.inputDO.toUpperCase())) {
                        this.riwayatPencarian.unshift(this.inputDO.toUpperCase());
                        // Max 5 riwayat
                        if (this.riwayatPencarian.length > 5) {
                            this.riwayatPencarian.pop();
                        }
                    }
                } else {
                    this.showError = true;
                    this.showResult = false;
                }
                
                this.isLoading = false;
            }, 800);
        },
        
        cariUlang(doNumber) {
            this.inputDO = doNumber;
            this.cariDO();
        }
    },
    
    mounted() {
        console.log('Tracking App mounted - Vue.js initialized');
    }
}).mount('#app');