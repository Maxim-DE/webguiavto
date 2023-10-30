import { refreshGlobalStore } from "../global_store_slice";
import { store } from "../store";

import { type_device_toStr } from "../../logic/output_data_management";
import { reload_page } from "../../logic/utilites";
import { setAuthLevel, setIsAuth, setUserId } from "../auth_store_slice";
import { toast } from "react-toastify";

export const reducers = {

  // обработка запросов на обновление данных основных настроек
  section_data: ({request_name, request_resp}) => {
    switch (request_name) {
      case 'info':
        // Преобразуем тип устройства в строковый формат для отображения в интерфейсе (при наличии в ответе)
        if (Object.hasOwn(request_resp.info_general, 'type')) {
          request_resp.info_general.Type_Device = type_device_toStr(request_resp.info_general.type)
        }

        // Проверяем наличие информации в разделе
        // Если информации о правах доступа нет, то устанавливаем уровень доступа 0(низший)
        if (!Object.hasOwn(request_resp, 'auth_info')) {
          store.dispatch(setAuthLevel(0))
          store.dispatch(setUserId('guest'))
          store.dispatch(setIsAuth(false))

          break;

        // Если информация о правах доступа есть, то устанавливаем уровень доступа и авторизацию
        } else {
          const auth_info = request_resp.auth_info
          console.log(auth_info);
          
          if (auth_info.auth_level > 0) {
            store.dispatch(setIsAuth(true))
          } else {
            store.dispatch(setIsAuth(false))
          }
  
          store.dispatch(setAuthLevel(auth_info.auth_level))
          store.dispatch(setUserId(auth_info.auth_id))
        }
        
        break;
    
      default:
        break;
    }

    let obj_to_refresh = {
      global_data: {
        section_data: {
          [request_name]: request_resp,
        }
      }
    }

    // toast.success('саси жепу', { autoClose: 1500 })

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  // обработка данных калибровки
  calibration_data: ({request_resp}) => {
    let obj_to_refresh = {
      global_data: {
        calib_state: {
          data: request_resp,
        }
      }
    }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  },

  // Перезагрузка страницы после перезагрузки устройства
  reboot_device: () => {
    reload_page()
  }
}