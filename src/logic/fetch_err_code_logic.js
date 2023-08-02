export default function fetch_err_code_logic(err_code) {
  switch (err_code) {
    case 401:
      return 'Доступ запрещен'
  
    default:
      return `Invalid response code: ${err_code}`
  }
}