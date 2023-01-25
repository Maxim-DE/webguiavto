import React from 'react';
// import ReactDOM from 'react_dom';

import Status_settings from "../status_settings_block"
import Settings_block from '../settings_block';
import Status_logs from "../status_logs_block"
import Status_graphs from "../graph_blocks"

import './index.css'

function StatusSection(props) {
  const timerRef = React.useRef();

  const handleUpdate = request => {
    props.updateHandler(request);
  }

  const handleClick = block_data => {
    block_data.name = props.section_name;
    props.updateHandler(block_data);
  }


  React.useEffect(() => {

    if (!Array.isArray(props.device_type)) {
      return
    }

    const device_power_table = {
            0: '_10',
            1: '_50',
            2: '_100',
            3: '_250',
            4: '_300',
            5: '_500',
            6: '_1000',
            7: '_2000',
            8: '_5000',
          },

          device_name_table = {
            0: 'urc',
            1: 'ust',
            2: 'st',
            3: 'bc'
          }
    
    const device_name = device_name_table[props.device_type[0]],
          device_power = device_power_table[props.device_type[1]]
          
    let svg_req_str = `${device_name}${device_power}.svg.gz`

    // switch (props.device_type) {
    //   case 'СТ-100':
    //     svg_req_str = 'st_100.svg.gz'
    //     break;

    //   case 'СТ-250':
    //     svg_req_str = 'st_250.svg.gz'
    //     break;

    //   case '':
    //     return;
    
    //   default:
    //     break;
    // }


    let request_obj = {
      address: 'static/media/status_graph/' + svg_req_str,
      type: 'text',
      notifications: {
        good: 'none',
        bad: 'default'
      },
      
    }

    props.updateHandler(request_obj)

    
    let full_log_req_obj = {
      address: 'GetLogErrorFull.cgi',
      data: 'userlog$1'
    }
    
    props.updateHandler(full_log_req_obj)
    

    let status_request_obj = {
      address: 'status.cgi',
      notifications: {
        good: 'none',
        bad: 'default'
      },
    }

    clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      props.updateHandler(status_request_obj)
    }, 1000)
  }, [props.device_type])

  return (
    <section
      id={`${props.section_name}_section`}
      className='section'>
      <div className="section_header">
        <h2>СТАТУС: 
          {props.status_data && !!(props.status_data.device_status) 
            ? ' ВКЛ.'
            : ' ВЫКЛ.'
          }
        </h2>
        <span
          style={{textAlign: "right"}}>
          {props.status_data && props.status_data.time}
        </span>
      </div>
      <div className="section_status">
        <Status_graphs
          settings_type="graphs"
          graph_svg={props.graph_svg.img}
          updateHandler={handleUpdate}
          data={props.graph_data}/>
        <div className='status_settings_wrap'>
          <Status_logs 
            settings_type="logs" 
            header="журнал" 
            data={props.logs_data}
            full_data={props.full_logs_data}
            updateHandler={handleUpdate}/>
          <Status_settings
            updateHandler={handleUpdate}
            settings_data={props.status_data && props.settings_data} 
          />
        </div>
      </div>
    </section>
  )
}

export default StatusSection;
