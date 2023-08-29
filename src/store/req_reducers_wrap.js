// Шаблон объекта для редюсера в Redux
export const redux_payload_template = {
  name: '',
  data: {
    resp_obj: {},
    params: '' 
  }
}

// Обертка для функции-reducer(функция изменения global_store)
// принимает payload(объект с данными для измениения), и сам reducer
export function reqReducers_wrap({ 
  payload_obj = redux_payload_template, 
  reducer = () => {return} }) {

  const request_name = payload_obj.name,
        request_resp = payload_obj.data.resp_obj,
        request_params = payload_obj.data.params
  
  let reducer_options = {
    request_name: request_name,
    request_resp: request_resp,
    request_params: request_params
  }

  reducer(reducer_options)
  
}