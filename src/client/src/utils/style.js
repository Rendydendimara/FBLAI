export const renderColorStatus = (status) => {
  switch (status) {
    case 'diterima':
      return 'green.600'
    case 'ditolak':
      return 'red.600'
    case 'Belum dikonfirmasi':
      return 'yellow.600'
    default:
      return 'primary'
  }
}