const getSheetsNameByCallNumber = (callNumber) => {
  switch (callNumber) {
    case 1:
      return ["ALK + PB (AMERICA)", "ALK + PB (EROPA)", "ALK + PB (AFRIKA)", "ALKITAB  PB - ASIA"]
    case 2:
      return ["ALKITAB BHS. DAERAH - NON LAI", "PB IND NON - LAI", "ALKITAB - NON LAI", "PB DAERAH NON -  LAI"]
    case 3:
      return ["BULETIN & RENUNGAN - NON LAI", "MAJALAH, TABLOID - NON LAI"]
    case 4:
      return ["PORS. ASIA", "PORS. AFRIKA", "PORS. AMERIKA", "PORS. EROPA", "PORS. AUSTRALIA", "PORS. BHS. IND - NON LA", "PORS. BHS DAERAH - NON LA"]
    case 5:
      return ["SEL. NON LAI"]
    case 6:
      return ["KOLEKSI ANAK - NON LAI"]
    case 7:
      return ["UMUM"]
    case 8:
      return ["JURNAL - NON LAI"]
    case 9:
      return ["KONKORDANSI"]
    case 10:
      return []
    case 11:
      return ["ENSIKLOPEDI"]
    case 12:
      return ["KAMUS"]       
    default:
      return []    
  }
}

module.exports = {getSheetsNameByCallNumber}

// - Alkitab/PB disatukan 1 Subject (Alkitab Non LAI)
// - Majalah dan Buletin dijadikan 1 Subject (Majalah dan Buletin Non LAI)
// - Porsion (PORS) dijadikan 1 Subject (Porsion Non LAI)
// - Koleksi Anak + AV + Puzzle dijadikan 1 Subject (Koleksi Anak)
// - Sel (Seleksion Non LAI)
// - Umum (Buku Umum)


// Alkitab & PB LAI=1
// Alkitab & PB Non LAI=2
// Majalah & Buletin=3
// Porsion=4
// Seleksion=5
// Koleksi Anak=6
// Umum=7
// Jurnal=8
// Konkordansi=9
// Altutang=10
// Encyclopedia=11
// Kamus=12

// name: 'COMM, TEO, TAF, KAM, DLL',
// name: 'ENSIKLOPEDI',
// name: 'KONKORDANSI',
// name: 'KAMUS',
// name: 'ALKITAB BHS. DAERAH - NON LAI',
// name: 'PB IND NON - LAI',
// name: 'ALKITAB - NON LAI',
// name: 'PB DAERAH NON -  LAI',
// name: 'ALK + PB (AMERICA)',
// name: 'ALK + PB (EROPA)',
// name: 'ALK + PB (AFRIKA)',
// name: 'ALKITAB  PB - ASIA',
// name: 'KOLEKSI ANAK - NON LAI',
// name: 'LINGUISTIK - NON LAI',
// name: 'JURNAL - NON LAI',
// name: 'MAJALAH, TABLOID - NON LAI',
// name: 'BULETIN & RENUNGAN - NON LAI',
// name: 'PORS. ASIA', 
// name: 'PORS. AFRIKA', 
// name: 'PORS. AMERIKA',
// name: 'PORS. EROPA',
// name: 'PORS. AUSTRALIA',
// name: 'PORS. BHS. IND - NON LAI'
// ame: 'PORS. BHS DAERAH - NON LAI',
// name: 'AV - NON LAI'
// name: 'SEL. NON LAI'
// name: 'UMUM',
// name: 'PUZZLE,dll',