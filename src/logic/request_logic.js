function sectionData_format(state, section_name, data) {
  let data_entries = Object.entries(data);
  state[section_name] = data_entries;
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
  const url = `http://192.168.1.114${host}/${query}${data}`;
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
      console.log(req_data);
      resp_obj = {
        name: request_name,
        status: 'success',
        data: req_data
      }
      return resp_obj
    }
  } catch (error) {
    const message = `An error has occured: ${error}`;
    console.log(message);
    console.dir(error)
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
  }

  return queue_response;
}

export {sectionData_format, async_Fetch_queue}
