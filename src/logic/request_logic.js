import useAuthStore from "./auth_store";
import useGlobalStore from "./global_store";

import { type_device_toStr } from "./output_data_management";

const [authGlobalState, authGlobalActions] = useAuthStore()
const [allGlobalState, allGlobalActions] = useGlobalStore()

const test_outputData_assignment = (output_name, output_data) => {
  if (output_name === 'peripheral_structure') {
    console.log(allGlobalState.peripheral_data);
    // setPeripheralData(prevState => ({
    //   ...prevState,
    //   structure: output_data[`structure`],
    // }))

  } else if (/^status/.test(output_name)) {
    let status_state_copy = allGlobalState.status_data;
    console.log(status_state_copy);
    for (const key in output_data) {
      status_state_copy[key] = output_data[key];
    }
    // setStatusData(status_state_copy)

  } else if (/media\/status_graph/gi.test(output_name)) {
    let status_state_copy = allGlobalState.status_data;
    let output_obj = {
      img: output_data
    }
    status_state_copy.status_svg = output_obj;

    console.log(status_state_copy);

    // setStatusData(prevState => ({
    //   ...prevState,
    //   status_svg: output_obj,
    // }))

  } else if (output_name === 'GetLogErrorFull') {

    let status_state_copy = allGlobalState.status_data;
    for (const key in output_data) {
      status_state_copy[key] = output_data[key];
    }

    // setStatusData(status_state_copy)

  } else if (output_name === 'SysLog') {
    // setCalibState(prevState => ({
    //   ...prevState,
    //   data: {
    //     ...prevState.data,
    //     calib_misc: {
    //       ...prevState.data.calib_misc,
    //       sys_log: output_data
    //     }
    //   }
    // }))

  } else if (output_name === 'calibration') {
    // setCalibState(prevState => ({
    //   ...prevState,
    //   data: output_data
    // }))

  } else if (output_name === 'calib_passw') {
    // authGlobalActions.set_is_auth(true)
    // authGlobalActions.set_auth_level(3)

  } else if (/^calib_.*/g.test(output_name)) {
    // setCalibState(prevState => ({
    //   ...prevState,
    //   data: output_data
    // }))
  } else {
    let output_data_copy

    switch (output_name) {
      case 'info':
        if (Object.hasOwn(output_data.info_general, 'type')) {
          output_data_copy = type_device_toStr(output_data)
        } else {
          output_data_copy = output_data
        }

        break;

      default:
        output_data_copy = output_data
        break;
    }

    // setSectionData(prevState => ({
    //   ...prevState,
    //   [output_name]: output_data_copy,
    // }))
  }
}

function sectionData_format(state, section_name, data) {
  let data_entries = Object.entries(data);
  state[section_name] = data_entries;
}

function dataArray_to_string(data_array) {
  let block_data = data_array;
  let data_string = '';

  for (const key in block_data) {
    if (block_data[key].length === 0) {
      data_string += `${key}$NULL;`

      // setBlockData(prevState => ({
      //   ...prevState,
      //   [key]: ''
      // }));

      continue
    }

    data_string += `${key}$${block_data[key]};`
  }

  return data_string
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetch_req(url, options, n) {
  try {
    return await fetch(url, options);
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
  const url = `http://192.168.1.9${host}/${query}${data}`;
  const retries_num = request.retries ? request.address : 0

  const test_url = "http://192.168.1.114/GetDebug.CGI"

  console.log(url);
  let responseClone;
  let resp_obj = {}
  let request_name = request.address.replace('.cgi', '')
      request_name = request_name.replace('set_', '')

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
        const req_status = req_data.Notific.status
        if (req_status == 'error') throw new Error(req_data.Notific.text)
      }

      resp_obj = {
        name: request_name,
        status: 'success',
        data: req_data
      }
      return resp_obj
    }
  } catch (error) {
    const message = `An error has occured: ${error}`;
    console.error(message);
    resp_obj = {
      name: request_name,
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

export { sectionData_format, async_Fetch_queue, dataArray_to_string, test_outputData_assignment }
