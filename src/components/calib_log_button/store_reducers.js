import { store } from "../../store/store";
import { setIsAuth, setUserId, setAuthLevel } from "../../store/auth_store_slice";

export const reducers = {

  // Обновляем данные авторизации после успешной авторизации
  calib_passw: ({request_resp}) => {
    store.dispatch(setIsAuth(true))
    store.dispatch(setUserId(request_resp.auth_info.auth_id))
    store.dispatch(setAuthLevel(request_resp.auth_info.auth_level))
  },

  // очистка данных авторизации при выходе из аккаунта
  logout: () => {
    store.dispatch(setIsAuth(false))
    store.dispatch(setUserId(''))
    store.dispatch(setAuthLevel(0))
  }
}