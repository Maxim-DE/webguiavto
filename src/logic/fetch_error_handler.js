// import { ToastContainer, toast, Zoom } from 'react-toastify';

export function fetch_error_handler(state_handler, error_obj) {
  console.log(error_obj);

  state_handler.total_err_increment()

  switch (error_obj.name) {
    case 'status':
      state_handler.status_err_increment()
      break;
  
    default:
      break;
    }
    
}