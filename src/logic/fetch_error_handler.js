// import { ToastContainer, toast, Zoom } from 'react-toastify';

import { total_err_increment, status_err_increment } from "../store/errPool_store_slice";

import { store } from "../store/store";

export function fetch_error_handler(error_obj) {
  console.log(error_obj);

  // state_handler.total_err_increment()
  store.dispatch(total_err_increment())

  switch (error_obj.name) {
    case 'status':
      // state_handler.status_err_increment()
      store.dispatch(status_err_increment())
      break;
  
    default:
      break;
    }
    
}