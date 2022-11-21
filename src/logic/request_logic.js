
// function updatePool(state, request_data) {
//   if (request_data) {
//     return {
//       pool: state.pool.concat(request_data),
//     };
//   }
// }

function sectionData_format(state, section_name, data) {
  let data_entries = Object.entries(data);
  state[section_name] = data_entries;
}

const async_Fetch_queue = async (queue_arr) => {
  const last_index = queue_arr.length - 1;
  let queue_response = [];

  for (let i = 0; i < queue_arr.length; i++) {
    const host = ""
    const request = queue_arr[i];
    const query = request.address;
    const data = request.data ? `?${request.data}` : '';
    const url = `http://192.168.1.114${host}/${query}${data}`;

    const test_url = "http://192.168.1.114/GetDebug.CGI"

    console.log(url);
    let responseClone;
    const fetch_opts = request.fetch_opts ? request.fetch_opts : {}

    try {
      const response = await fetch(url, fetch_opts)
      if (response.status == 200) {
        const req_data = await response.json()
        queue_response.push(req_data)
        console.log(req_data);
      }
    } catch (error) {
      const message = `An error has occured: ${error}`;
      queue_response.push(message)
      console.log(message);
      console.dir(error)
      continue
    }
  }

  return queue_response;
}

// console.log('cached pool state');
//         console.log(pool_state);
//         let pool_response = async_Fetch_queue(pool_state);
        
//         console.log(pool_response);
          
//         pool_state.forEach((request, k) => {
//           const last_index = pool_state.length - 1;
          
//           setTimeout(() => {
//             // console.log('do do' + k);
//             // console.log(request);
            
//             const host = ""
//             const query = request.address;
//             const data = request.data ? `?${request.data}` : '';
//             const url = `http://192.168.1.114${host}/${query}${data}`;
      
//             const test_url = "http://192.168.1.114/GetDebug.CGI"

//             // console.log(url);
//             let responseClone;
//             const fetch_opts = request.fetch_opts ? request.fetch_opts : {}

//             fetch(url, fetch_opts)

//             .then(res => {
//               responseClone = res.clone();
//               return res.json();
//             })

//             .then(
//               (result) => {
//                 // console.log('harosh');
//                 if (request.notifications) {
//                   if (request.notifications.good == 'default') {
//                     // showSuccessMessage("", 'Успешно', 1500);
//                     if (Object.hasOwn(result, 'Notific')) {
//                       const message = `${result.Notific.text} (${request.address.replace('.cgi', '')})`,
//                             status = result.Notific.status

//                       switch (status) {
//                         case 'ok':
//                           toast.success(message, {autoClose: 1500})
//                           break;

//                         case 'error':
//                           toast.error(message, { autoClose: 1500 })
//                           break;
                      
//                         default:
//                           break;
//                       }
//                     } else {
//                       toast.success(`Успешно (${request.address.replace('.cgi', '')})`, { autoClose: 1500 })
//                     }
//                   } 
//                 }
//                 if (Object.keys(result).length == 1 &&
//                     Object.hasOwn(result, 'STATUS')) {

//                   return
                    
//                 } else {
//                   // console.log(this);
//                   let request_name = request.address.replace('.cgi', '')
//                   request_name = request_name.replace('set_', '')
//                   outputData_assignment(request_name, result);
//                 }

//                 // console.dir(result);
                
//               },

//               (error) => {
//                 // console.log(error.message);
//                 // console.log(responseClone);
//                 if (request.type) {
//                   switch (request.type) {
//                     case 'text':
//                       responseClone.text()
//                       .then(
//                         (resText) => {
//                           // console.log(resText);
//                           let request_name = request.address.replace('.cgi', '')
//                           request_name = request_name.replace('set_', '')
//                           outputData_assignment(request_name, resText);
//                         },
//                         (errText) => {
//                           if (request.notifications) {
//                             if (request.notifications.bad == 'default') {
//                               toast.error(`Ошибка (${request.address.replace('.cgi', '')})`, { autoClose: 1500 })
//                               // showErrorMessage("", 'Ошибка', 1500);
//                             }
//                           }
//                         }
//                       )
//                       break;
                  
//                     default:
//                       break;
//                   }
//                 } else {
//                   if (request.notifications) {
//                     if (request.notifications.bad == 'default') {
//                       toast.error(`Ошибка (${request.address.replace('.cgi', '')})`, { autoClose: 1500 })
//                       // showErrorMessage("", 'Ошибка', 1500);
//                     } else {
//                       toast.error(request.notifications.bad, { autoClose: 1500 })
//                     }
//                   }
//                 }
//               })

//           }, 150 * k);
  
//           if (k == last_index) {
//             setRequestPool({
//               pool: []
//             });
  
//             console.log('done');
            
//           }
  
//         });

export {sectionData_format}
