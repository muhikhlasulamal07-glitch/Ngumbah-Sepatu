# Skrip perbaikan navbar - menambahkan link "Pesanan Saya" dan "Profil"
# ke halaman yang belum memilikinya.
#
# CATATAN: Perbaikan navbar sudah dilakukan secara langsung pada file HTML.
# Skrip ini disimpan sebagai dokumentasi/backup dan TIDAK perlu dijalankan.

function Rep {
    param([string]$p, [string]$o, [string]$n)
    $c = [System.IO.File]::ReadAllText($p)
    if (-not $c.Contains($o)) { Write-Output "NOTFOUND: $p" }
    else {
        $c2 = $c.Replace($o, $n)
        [System.IO.File]::WriteAllText($p, $c2)
        Write-Output "OK: $p"
    }
}

$car   = '<li class="nav-item"><a class="nav-link" href="index.html#cara-kerja">Cara Kerja</a></li>'
$pes   = '<li class="nav-item"><a class="nav-link" href="pesanan-saya.html">Pesanan Saya</a></li>'
$pro   = '<li class="nav-item"><a class="nav-link" href="profil.html">Profil</a></li>'

# Pola lama: hanya ada link Layanan lalu langsung Cara Kerja
$oldNav = '<li class="nav-item"><a class="nav-link" href="layanan.html">Layanan</a></li>' + "`n                    " + $car
# Pola baru: sisipkan Pesanan Saya dan Profil sebelum Cara Kerja
$newNav = '<li class="nav-item"><a class="nav-link" href="layanan.html">Layanan</a></li>' + "`n                    " + $pes + "`n                    " + $pro + "`n                    " + $car

# Daftar halaman yang perlu diperbaiki (navbar belum lengkap)
$files = @(
    'detail-layanan.html',
    'pemesanan.html',
    'konfirmasi-pesanan.html',
    'pesanan-saya.html',
    'profil.html'
)

foreach ($f in $files) {
    Rep -p $f -o $oldNav -n $newNav
}
