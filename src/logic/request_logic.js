import fetch_err_code_logic from "./fetch_err_code_logic";
import { filter_obj } from "./utilites";

function sectionData_format(state, section_name, data) {
  let data_entries = Object.entries(data);
  state[section_name] = data_entries;
}


function dataArray_to_string(data_array) {
  let block_data = data_array;
  let data_string = '';

  recursvive_obj_handle(block_data)

  function recursvive_obj_handle(object) {
    for (const key in object) {
      if (object[key].length === 0) {
        data_string += `${key}$NULL;`
        continue
  
      } else if (typeof object[key] === 'object') {
        recursvive_obj_handle(object[key])
      } else if (typeof object[key] === 'boolean') {
        data_string += `${key}$${Number(object[key])};`
      } else {
        data_string += `${key}$${object[key]};`
      }
    }
  }

  return data_string
}

function params_to_obj(param_array) {
  if (param_array.length == 0) {
    return ''
  }

  let param_obj = {}

  for (let param = 0; param < param_array.length; param++) {
    if (param_array[param].length == 0) continue

    const param_divided = param_array[param].split('$'),
          key = param_divided[0],
          value = param_divided[1]

    param_obj[key] = value
  }

  return param_obj
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetch_req(url, options = {}, n) {
  const {timeout = 8000} = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id)
    
    return response

  } catch (e) {
    if (n <= 1) throw e;
    await sleep(50);
    return await fetch_req(url, options, n - 1);
  }
}

async function fetch_data(req_obj) {
  const host = ""
  const request = req_obj;
  const query = request.address;
  const data = request.data ? `?${request.data}` : '';
  const url = `http://192.168.0.121${host}/${query}${data}`;
  const retries_num = request.retries ? request.address : 0

  const test_url = "http://192.168.0.114/GetDebug.CGI"

  console.log(url);
  let resp_obj = {}
  let request_name = request.address.replace('.cgi', '')
      request_name = request_name.replace('set_', '')
      request_name = request_name.replace('get_', '')

  let request_params = []

  if (data.length != 0) {
    request_params = request.data.split(';')
    console.log(request_params);
  }
  

  const fetch_opts = request.fetch_opts ? request.fetch_opts : {}

  try {
    const response = await fetch_req(url, fetch_opts, retries_num)
    if (response.status == 200) {
      let req_data
      if (request.type) {
        switch (request.type) {
          case 'text':
            req_data = await response.text()
            break;
        
          default:
            req_data = await response.json()
            break;
        }
      } else {
        req_data = await response.json()
      }

      if (Object.hasOwnProperty.call(req_data, 'Notific')) {
        const req_status = req_data.Notific.status,
              resp_data = filter_obj(req_data, (key, value) => key != 'Notific')
              
        if (req_status == 'error') {
          if (Object.keys(resp_data).length > 0) {
            resp_obj = {
              name: request_name,
              params: params_to_obj(request_params),
              status: 'error',
              data: req_data
            }

            return resp_obj

          } else {
          throw new Error(req_data.Notific.text)
          }
        }
      }

      resp_obj = {
        name: request_name,
        params: params_to_obj(request_params),
        status: 'success',
        data: req_data
      }
      return resp_obj
    } else {
      const err_message = fetch_err_code_logic(response.status)
      throw new Error(`${err_message}`)
    }

  } catch (error) {
    let message = `An error has occured: ${error.message}`

    console.error(message);

    resp_obj = {
      name: request_name,
      params: params_to_obj(request_params),
      status: 'error',
      data: error
    }

    return resp_obj
  }
}

const async_Fetch_queue = async (queue_arr) => {
  const last_index = queue_arr.length - 1;
  let queue_response = [];
  for (let i = 0; i < queue_arr.length; i++) {
    let req_data = await fetch_data(queue_arr[i])
    queue_response.push(req_data)
    await sleep(100);
  }

  return queue_response;
}

export { sectionData_format, async_Fetch_queue, dataArray_to_string }
