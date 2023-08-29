import { store } from "../store";
import { refreshGlobalStore } from "../global_store_slice";

import { add_info_to_conf } from "../../components/custom_groups/conf_manage_settings";

// обработка информации о конфигурации
export const reducers = {
  get_conf_info: ({request_resp, request_params}) => {
    const conf_name = request_params.name,
          store_tree = store.getState()

    const obj_to_refresh = {
        global_data: {
          section_data: {
            settings: {
              // Обновляем информацию о конфигурации
              conf_manage: add_info_to_conf(request_resp, store_tree, conf_name)
            },
          }
        }
      }

    store.dispatch(refreshGlobalStore(obj_to_refresh))
  }
}