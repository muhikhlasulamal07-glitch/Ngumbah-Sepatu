var LAYANAN_DATA = {
    'fast-clean': {
        icon: '⚡',
        name: 'Fast Clean',
        price: 'Rp 25.000',
        estimasi: '1-2 hari',
        deskripsi: 'Cleansing kilat untuk sepatu harian, kerja, atau kegiatan santai yang tidak terlalu kusut. Hasil bersih dan siap pakai dalam waktu singkat.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80&auto=format&fit=crop',
        manfaat: [
            'Perawatan cepat untuk pemakaian rutin',
            'Hasil bersih dan siap pakai',
            'Menghemat waktu perawatan'
        ],
        jenis: [
            'Sepatu harian, kerja, atau kegiatan santai',
            'Sepatu dengan kebersihan terbatas'
        ]
    },
    'deep-clean': {
        icon: '🧼',
        name: 'Deep Clean',
        price: 'Rp 40.000',
        estimasi: '3-5 hari',
        deskripsi: 'Pembersihan mendalam hingga ke dalam sela sepatu, sol, dan panel samping. Cocok untuk sepatu yang terlihat sangat kotor atau penat setelah pemakaian berat.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80&auto=format&fit=crop',
        manfaat: [
            'Memulihkan kebersihan total',
            'Membersihkan dalam termasuk sela sepatu',
            'Meningkatkan umur sepatu'
        ],
        jenis: [
            'Sepatu yang terlihat sangat kotor',
            'Sepatu penat setelah pemakaian berat'
        ]
    },
    'unyellowing': {
        icon: '☀️',
        name: 'Unyellowing',
        price: 'Rp 50.000',
        estimasi: '5-7 hari',
        deskripsi: 'Metode khusus penghilangan yellowing pada sepatu putih dan krem akibat keringat, debu, atau sinar matahari. Warnanya kembali cerah seperti baru.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80&auto=format&fit=crop',
        manfaat: [
            'Mengembalikan warna asli sepatu',
            'Menghilangkan yellowing',
            'Hasil maksimal untuk sepatu putih dan krem'
        ],
        jenis: [
            'Sepatu putih atau krem',
            'Sepatu dengan masalah yellowing'
        ]
    }
};

$(document).ready(function () {
    // Menutup menu navigasi mobile (Bootstrap Collapse) saat salah satu link menu dipilih
    var $navCollapse = $('#navMenu');

    $navCollapse.on('click', '.nav-link', function () {
        var collapseElement = $navCollapse[0];

        if (collapseElement.classList.contains('show')) {
            if (window.bootstrap && typeof window.bootstrap.Collapse !== 'undefined') {
                var collapse = window.bootstrap.Collapse.getOrCreateInstance(collapseElement);
                collapse.hide();
            }
        }
    });

        // ---------- Sistem Autentikasi (Prototype - simulasi login pelanggan) ----------
    var KEY_AKUN = 'akunNgumbahSepatu';
    var KEY_SESI = 'sesiNgumbahSepatu';

    // Demo hash sederhana (bukan keamanan, hanya simulasi untuk prototype)
    function hashPasswordSimulasi(password) {
        var s = String(password || '');
        var h = 5381;
        for (var i = 0; i < s.length; i++) {
            h = ((h * 33) + s.charCodeAt(i)) % 2147483647;
        }
        return 'simulasi-' + h.toString(36);
    }

    function bacaDaftarAkun() {
        var list = [];
        var raw = localStorage.getItem(KEY_AKUN);
        if (raw) { try { list = JSON.parse(raw); } catch (e) { list = []; } }
        if (!Array.isArray(list)) { list = []; }
        return list;
    }

    function simpanDaftarAkun(list) { localStorage.setItem(KEY_AKUN, JSON.stringify(list)); }

    function dapatSesi() {
        var raw = localStorage.getItem(KEY_SESI);
        if (!raw) { return null; }
        try { return JSON.parse(raw); } catch (e) { return null; }
    }

    function akunAktif() {
        var sesi = dapatSesi();
        if (!sesi || !sesi.email) { return null; }
        var list = bacaDaftarAkun();
        var emailLower = String(sesi.email).toLowerCase();
        for (var i = 0; i < list.length; i++) {
            if (list[i] && String(list[i].email || '').toLowerCase() === emailLower) {
                return { email: list[i].email, nama: list[i].nama || sesi.nama || '', whatsapp: list[i].whatsapp || '' };
            }
        }
        return null;
    }

    function isLoggedIn() { return akunAktif() !== null; }

    function setSesiLogin(email, nama) {
        localStorage.setItem(KEY_SESI, JSON.stringify({ email: email, nama: nama, loginAt: Date.now() }));
    }

    function hapusSesiLogin() { localStorage.removeItem(KEY_SESI); }

    function loginUser(email, password) {
        var list = bacaDaftarAkun();
        var emailLower = String(email || '').trim().toLowerCase();
        var akun = null;
        for (var i = 0; i < list.length; i++) {
            if (list[i] && String(list[i].email || '').toLowerCase() === emailLower) { akun = list[i]; break; }
        }
        if (!akun || akun.passwordHash !== hashPasswordSimulasi(password)) {
            return { sukses: false, pesan: 'Email atau password salah.' };
        }
        setSesiLogin(akun.email, akun.nama);
        return { sukses: true, akun: akun };
    }

    function logoutUser() { hapusSesiLogin(); }

    function cekEmailTerdaftar(email) {
        var emailLower = String(email || '').trim().toLowerCase();
        var list = bacaDaftarAkun();
        for (var i = 0; i < list.length; i++) {
            if (list[i] && String(list[i].email || '').toLowerCase() === emailLower) { return true; }
        }
        return false;
    }

    function daftarAkunBaru(nama, email, whatsapp, password) {
        var list = bacaDaftarAkun();
        list.push({
            nama: nama,
            email: email,
            whatsapp: whatsapp,
            passwordHash: hashPasswordSimulasi(password),
            createdAt: Date.now()
        });
        simpanDaftarAkun(list);
    }

    // Seed akun demo (prototype) agar bisa langsung mencoba login
    if (bacaDaftarAkun().length === 0) {
        simpanDaftarAkun([
            { nama: 'Demo Pelanggan', whatsapp: '081234567890', email: 'demo@ngumbahsepatu.id', passwordHash: hashPasswordSimulasi('demo123'), createdAt: Date.now() }
        ]);
    }

    // ---------- Integrasi navbar dengan kondisi login ----------
    function perbaruiNavbarAuth() {
        var loginAktif = isLoggedIn();
        var $btnLogin = $('#btnNavLogin');
        var $btnRegister = $('#btnNavRegister');
        var $btnLogout = $('#btnLogout');
        var $linkPesanan = $('a[href="pesanan-saya.html"]');
        var $linkProfil = $('a[href="profil.html"]');

        if (loginAktif) {
            if ($linkPesanan.length) { $linkPesanan.attr('href', 'pesanan-saya.html'); }
            if ($linkProfil.length) { $linkProfil.attr('href', 'profil.html'); }
            if ($btnLogin) { $btnLogin.hide(); }
            if ($btnRegister) { $btnRegister.hide(); }
            if ($btnLogout) { $btnLogout.show(); }
        } else {
            if ($linkPesanan.length) { $linkPesanan.attr('href', 'login.html'); }
            if ($linkProfil.length) { $linkProfil.attr('href', 'login.html'); }
            if ($btnLogin) { $btnLogin.show(); }
            if ($btnRegister) { $btnRegister.show(); }
            if ($btnLogout) { $btnLogout.hide(); }
        }
    }

    $('#btnLogout').on('click', function () {
        logoutUser();
        window.location.href = 'index.html';
    });

    // Perbarui navbar saat status login diperbarui
    perbaruiNavbarAuth();

    // ---------- Halaman Login: validasi & proses login ----------
    if ($('#formLogin').length) {
        var paramsAuth = new URLSearchParams(window.location.search);
        if (paramsAuth.get('registered')) {
            $('#loginSuccess').removeClass('d-none').text('Registrasi berhasil! Silakan login dengan email Anda.');
        }

        $('#formLogin').on('submit', function (e) {
            e.preventDefault();
            var $email = $('#loginEmail');
            var $password = $('#loginPassword');
            $('#formLogin .is-invalid').removeClass('is-invalid');
            var ok = true;

            function kosong($el) { return $.trim(String($el.val() || '')).length === 0; }

            if (kosong($email)) { $('#loginEmail').addClass('is-invalid'); ok = false; }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($.trim($email.val()))) { $('#loginEmail').addClass('is-invalid'); ok = false; }
            if (kosong($password)) { $('#loginPassword').addClass('is-invalid'); ok = false; }
            if (!ok) { return; }

            var hasil = loginUser($email.val(), $password.val());
            if (hasil.sukses) {
                window.location.href = 'index.html';
                return;
            }
            $('#loginError').text(hasil.pesan || 'Email atau password salah.').removeClass('d-none');
            $('#loginPassword').addClass('is-invalid');
        });
    }

    // ---------- Halaman Register: validasi & simpan akun ----------
    if ($('#formRegister').length) {
        $('#formRegister').on('submit', function (e) {
            e.preventDefault();
            var $nama = $('#regNama');
            var $email = $('#regEmail');
            var $whatsapp = $('#regWhatsapp');
            var $password = $('#regPassword');
            var $konfirmasi = $('#regKonfirmasi');
            $('#formRegister .is-invalid').removeClass('is-invalid');
            var ok = true;

            function kosong($el) { return $.trim(String($el.val() || '')).length === 0; }

            if (kosong($nama) || $.trim($nama.val()).length < 3) { $('#regNama').addClass('is-invalid'); ok = false; }
            if (kosong($email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($.trim($email.val()))) { $('#regEmail').addClass('is-invalid'); ok = false; }
            if (kosong($whatsapp) || $.trim(String($whatsapp.val()).replace(/[^0-9]/g, '')).length < 9) { $('#regWhatsapp').addClass('is-invalid'); ok = false; }
            if (kosong($password) || String($password.val()).length < 6) { $('#regPassword').addClass('is-invalid'); ok = false; }
            if (kosong($konfirmasi) || String($.trim($konfirmasi.val())) !== String($.trim($password.val()))) { $('#regKonfirmasi').addClass('is-invalid'); ok = false; }

            if (!ok) { return; }

            if (cekEmailTerdaftar($.trim($email.val()))) {
                $('#regError').text('Email sudah terdaftar. Silakan gunakan email lain atau login.').removeClass('d-none');
                $('#regEmail').addClass('is-invalid');
                return;
            }

            daftarAkunBaru($.trim($nama.val()), $.trim($email.val()), $.trim($whatsapp.val()), $password.val());
            window.location.href = 'login.html?registered=1';
        });
    }

    // ---------- Halaman Pemesanan: auto-select layanan dari URL ----------
    var params = new URLSearchParams(window.location.search);
    var layananIdFromUrl = params.get('layanan');
    if (LAYANAN_DATA[layananIdFromUrl]) {
        $('#layanan').val(layananIdFromUrl);
    }

    // ---------- Halaman Detail Layanan: membaca parameter URL (?layanan=...) ----------
    var detailLayananId = params.get('layanan');
    var detailData = LAYANAN_DATA[detailLayananId];

    if (detailData) {
        $('#detailLayananIcon').text(detailData.icon);
        $('#detailLayananName').text(detailData.name);
        $('#detailLayananPrice').text(detailData.price);
        $('#detailLayananEstimasi').text(detailData.estimasi);
        $('#detailLayananDesc').text(detailData.deskripsi);
        $('#detailLayananImage').attr('src', detailData.image);
        $('#detailLayananImage').attr('alt', 'Sepatu dengan layanan ' + detailData.name);
        $('#btnPesanLayananIni').attr('href', 'pemesanan.html?layanan=' + layananIdFromUrl);

        var benefitsHtml = '';
        for (var i = 0; i < detailData.manfaat.length; i++) {
            benefitsHtml += '<li>✓ ' + detailData.manfaat[i] + '</li>';
        }
        $('#detailLayananBenefits').html(benefitsHtml);

        var jenisHtml = '';
        for (var j = 0; j < detailData.jenis.length; j++) {
            jenisHtml += '<li>' + detailData.jenis[j] + '</li>';
        }
        $('#detailLayananJenis').html(jenisHtml);
    }

    // ---------- Halaman Pemesanan: toggle metode pengambilan ----------
    $('#metodeAntar, #metodePenjemputan').on('change', function () {
        var metode = $('input[name="metode"]:checked').val();
        if (metode === 'penjemputan') {
            $('#alamatField').removeClass('d-none');
        } else {
            $('#alamatField').addClass('d-none');
        }
    });

    // ---------- Halaman Pemesanan: hitung total otomatis ----------
    function dataLayananById(id) {
        if (id && LAYANAN_DATA[id]) { return LAYANAN_DATA[id]; }
        return null;
    }

    function hitungTotal() {
        var data = dataLayananById($('#layanan').val());
        var harga = data ? parseInt(String(data.price).replace(/\D/g, ''), 10) : 0;
        var jumlah = parseInt($('#jumlah').val(), 10) || 0;
        var total = harga * jumlah;
        $('#ringkasanLayanan').text(data ? data.name : '-');
        $('#ringkasanHarga').text('Rp ' + harga.toLocaleString('id-ID'));
        $('#ringkasanJumlah').text(jumlah);
        $('#ringkasanTotal').html('<strong>Rp ' + total.toLocaleString('id-ID') + '</strong>');
        return total;
    }

    $('#layanan, #jumlah').on('change keyup', function () { hitungTotal(); });

    // ---------- Halaman Pemesanan: validasi & buka modal konfirmasi ----------
    function validasiPemesanan() {
        var ok = true;

        function kosong($el) {
            return $.trim(String($el.val() || '')).length === 0;
        }

        $('#formPemesanan .is-invalid').removeClass('is-invalid');

        if (kosong($('#nama'))) { $('#nama').addClass('is-invalid'); ok = false; }
        if (kosong($('#whatsapp'))) { $('#whatsapp').addClass('is-invalid'); ok = false; }
        if (kosong($('#layanan'))) { $('#layanan').addClass('is-invalid'); ok = false; }
        var jumlah = parseInt($('#jumlah').val(), 10);
        if (isNaN(jumlah) || jumlah < 1) { $('#jumlah').addClass('is-invalid'); ok = false; }
        if (kosong($('#jenisSepatu'))) { $('#jenisSepatu').addClass('is-invalid'); ok = false; }
        if (kosong($('#tanggal'))) { $('#tanggal').addClass('is-invalid'); ok = false; }
        if ($('input[name="metode"]:checked').val() === 'penjemputan') {
            if (kosong($('#alamat'))) { $('#alamat').addClass('is-invalid'); ok = false; }
        }

        if (!ok) { return false; }
        return true;
    }

    $('#btnBuatPesanan').on('click', function () {
        if (!validasiPemesanan()) { return; }
        var data = dataLayananById($('#layanan').val());
        var total = hitungTotal();
        var harga = data ? parseInt(String(data.price).replace(/\D/g, ''), 10) : 0;
        var jumlah = parseInt($('#jumlah').val(), 10) || 0;

        $('#modalLayanan').text(data ? data.name : '-');
        $('#modalHarga').text('Rp ' + harga.toLocaleString('id-ID'));
        $('#modalJumlah').text(jumlah);
        $('#modalTotal').html('<strong>Rp ' + total.toLocaleString('id-ID') + '</strong>');

        var bsModal = bootstrap.Modal.getOrCreateInstance($('#modalKonfirmasi')[0]);
        bsModal.show();
    });

    // ---------- Konfirmasi Pesanan: simpan ke localStorage & redirect ----------
    $('#btnKonfirmasi').on('click', function () {
        var data = dataLayananById($('#layanan').val());
        var total = hitungTotal();
        var harga = data ? parseInt(String(data.price).replace(/\D/g, ''), 10) : 0;
        var jumlah = parseInt($('#jumlah').val(), 10) || 0;

        var pesanan = {
            id: Date.now(),
            nama: $('#nama').val(),
            whatsapp: $('#whatsapp').val(),
            email: $('#email').val(),
            layanan: data ? data.name : '-',
            layananId: $('#layanan').val(),
            hargaPerPasang: 'Rp ' + harga.toLocaleString('id-ID'),
            jumlah: jumlah,
            jenisSepatu: $('#jenisSepatu').val(),
            catatan: $('#catatan').val(),
            tanggal: $('#tanggal').val(),
            metode: $('input[name="metode"]:checked').val(),
            alamat: $('#alamat').val(),
            total: total
        };

        var list = [];
        var existing = localStorage.getItem('pesananNgumbahSepatu');
        if (existing) { try { list = JSON.parse(existing); } catch (e) { list = []; } }
        list.push(pesanan);
        localStorage.setItem('pesananNgumbahSepatu', JSON.stringify(list));

        var bsModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalKonfirmasi'));
        bsModal.hide();

        var toastEl = document.getElementById('toastSuksesPesanan');
        var toast = bootstrap.Toast.getOrCreateInstance(toastEl);
        $('#toastSuksesTeks').text('Pesanan berhasil dibuat! Terima kasih.');
        toast.show();

        setTimeout(function () { window.location.href = 'konfirmasi-pesanan.html'; }, 2000);
    });

    // ---------- Halaman Pesanan Saya: tampilkan riwayat pesanan dari localStorage ----------
    if ($('#listPesanan').length) {
        var listPesanan = [];
        var rawPesanan = localStorage.getItem('pesananNgumbahSepatu');
        if (rawPesanan) { try { listPesanan = JSON.parse(rawPesanan); } catch (e) { listPesanan = []; } }

        var $list = $('#listPesanan');
        var $empty = $('#emptyPesanan');
        var $cards = $('#pesananCards');

        if (listPesanan.length === 0) {
            $empty.removeClass('d-none');
            $cards.addClass('d-none');
        } else {
            $empty.addClass('d-none');
            $cards.removeClass('d-none');

            var html = '';
            for (var k = 0; k < listPesanan.length; k++) {
                var p = listPesanan[k];
                var status = p.status || 'Menunggu Konfirmasi';
                var statusClass = 'status-badge status-' + status.toLowerCase().replace(/\s+/g, '-');
                var tanggal = new Date(p.id).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

                html += '<div class="card bg-white service-card p-4 mb-4">';
                html += '    <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">';
                html += '        <h3 class="service-title mb-0">' + (p.layanan || '-') + '</h3>';
                html += '        <span class="' + statusClass + '">' + status + '</span>';
                html += '    </div>';
                html += '    <p class="mb-1"><strong>Nomor Pesanan:</strong> <span>#' + p.id + '</span></p>';
                html += '    <p class="mb-1"><strong>Layanan:</strong> <span>' + (p.layanan || '-') + '</span></p>';
                html += '    <p class="mb-1"><strong>Jumlah Pasang:</strong> <span>' + (p.jumlah || 0) + '</span></p>';
                html += '    <p class="mb-1"><strong>Tanggal Pemesanan:</strong> <span>' + tanggal + '</span></p>';
                html += '    <p class="mb-0"><strong>Total Harga:</strong> <span>Rp ' + ((p.total || 0).toLocaleString('id-ID')) + '</span></p>';
                html += '    <a href="detail-layanan.html?layanan=' + (p.layananId || 'fast-clean') + '" class="btn btn-outline-orange mt-3">Lihat Detail</a>';
                html += '    </div>';
                html += '</div>';
            }
            $cards.html(html);
        }
    }

    // ---------- Halaman Konfirmasi Pesanan: tampilkan pesanan terakhir ----------
    if ($('#konfirmasiNomor').length) {
        var listKonfirmasi = [];
        var rawKonfirmasi = localStorage.getItem('pesananNgumbahSepatu');
        if (rawKonfirmasi) { try { listKonfirmasi = JSON.parse(rawKonfirmasi); } catch (e) { listKonfirmasi = []; } }

        if (listKonfirmasi.length > 0) {
            var p = listKonfirmasi[listKonfirmasi.length - 1];
            var metodeText = p.metode === 'penjemputan' ? 'Penjemputan' : 'Antar Langsung';

            $('#konfirmasiNomor').text('#' + p.id);
            $('#konfirmasiNama').text(p.nama || '-');
            $('#konfirmasiLayanan').text(p.layanan || '-');
            $('#konfirmasiHarga').text(p.hargaPerPasang || '-');
            $('#konfirmasiJumlah').text(p.jumlah || 0);
            $('#konfirmasiTotal').text('Rp ' + ((p.total || 0).toLocaleString('id-ID')));
            $('#konfirmasiTanggal').text(p.tanggal || '-');
            $('#konfirmasiMetode').text(metodeText);
            $('#konfirmasiAlamat').text(p.alamat || '-');
            $('#konfirmasiCatatan').text(p.catatan || '-');
        }
    }

    // ---------- Halaman Profil: edit profil ----------
    if ($('#modalEditProfil').length) {
        var profil = {};
        var rawProfil = localStorage.getItem('profilNgumbahSepatu');
        if (rawProfil) { try { profil = JSON.parse(rawProfil); } catch (e) { profil = {}; } }

        $('#profilNama').val(profil.nama || '');
        $('#profilWhatsapp').val(profil.whatsapp || '');
        $('#profilEmail').val(profil.email || '');
        $('#profilDisplayNama').text(profil.nama || 'Pelanggan Ngumbah Sepatu');
        $('#profilDisplayWhatsapp').text(profil.whatsapp || '-');
        $('#profilDisplayEmail').text(profil.email || '-');
        $('#profilAvatar').text((profil.nama || 'P').charAt(0).toUpperCase());

        $('#btnEditProfil').on('click', function () {
            var profilEdit = {};
            var rawEdit = localStorage.getItem('profilNgumbahSepatu');
            if (rawEdit) { try { profilEdit = JSON.parse(rawEdit); } catch (e) { profilEdit = {}; } }
            $('#profilNama').val(profilEdit.nama || '');
            $('#profilWhatsapp').val(profilEdit.whatsapp || '');
            $('#profilEmail').val(profilEdit.email || '');

            var bsModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditProfil'));
            bsModal.show();
        });

        $('#btnSimpanProfil').on('click', function () {
            var ok = true;
            function kosong($el) { return $.trim(String($el.val() || '')).length === 0; }
            $('#modalEditProfil .is-invalid').removeClass('is-invalid');
            if (kosong($('#profilNama'))) { $('#profilNama').addClass('is-invalid'); ok = false; }
            if (kosong($('#profilWhatsapp'))) { $('#profilWhatsapp').addClass('is-invalid'); ok = false; }
            if (!ok) { return; }

            var profilBaru = {
                nama: $('#profilNama').val(),
                whatsapp: $('#profilWhatsapp').val(),
                email: $('#profilEmail').val()
            };
            localStorage.setItem('profilNgumbahSepatu', JSON.stringify(profilBaru));

            // Sinkronkan data profil dengan akun yang sedang login (prototype)
            if (dapatSesi() && profilBaru.email) {
                var listAkun = bacaDaftarAkun();
                var emailAkun = String(profilBaru.email).toLowerCase();
                for (var k = 0; k < listAkun.length; k++) {
                    if (listAkun[k] && String(listAkun[k].email || '').toLowerCase() === emailAkun) {
                        listAkun[k].nama = profilBaru.nama;
                        listAkun[k].whatsapp = profilBaru.whatsapp;
                        simpanDaftarAkun(listAkun);
                        break;
                    }
                }
            }

            $('#profilDisplayNama').text(profilBaru.nama);
            $('#profilDisplayWhatsapp').text(profilBaru.whatsapp);
            $('#profilDisplayEmail').text(profilBaru.email);
            $('#profilAvatar').text(profilBaru.nama.charAt(0).toUpperCase());

            var bsModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditProfil'));
            bsModal.hide();

            var toastEl = document.getElementById('toastSuksesProfil');
            var toast = bootstrap.Toast.getOrCreateInstance(toastEl);
            $('#toastSuksesProfilTeks').text('Profil berhasil disimpan!');
            toast.show();
        });
    }

    // ---------- Halaman Profil: ringkasan aktivitas ----------
    if ($('#aktivitasTotal').length) {
        var listPesanan = [];
        var rawPesanan = localStorage.getItem('pesananNgumbahSepatu');
        if (rawPesanan) { try { listPesanan = JSON.parse(rawPesanan); } catch (e) { listPesanan = []; } }
        var selesaiCount = 0;
        for (var m = 0; m < listPesanan.length; m++) {
            if (listPesanan[m].status === 'Selesai') { selesaiCount++; }
        }
        $('#aktivitasTotal').text(listPesanan.length);
        $('#aktivitasSelesai').text(selesaiCount);
    }

    console.log('Ngumbah Sepatu - Halaman Beranda berhasil dimuat.');
});
