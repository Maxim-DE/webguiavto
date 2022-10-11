import React from 'react';
import ReactDOM from 'react-dom';

import Status_settings from "../status_settings_block"
import Settings_block from '../settings_block';
import Status_logs from "../status_logs_block"
import Status_graphs from "../graph_blocks"

import * as windows1251 from 'windows-1251';

import './index.css'

function StatusSection(props) {

  const handleUpdate = request => {
    props.updateHandler(request);
  }

  const handleClick = block_data => {
    block_data.name = props.section_name;
    props.updateHandler(block_data);
  }


  React.useEffect(() => {
    let request_obj = {
      address: 'status.cgi',
    }

    let status_timer = setInterval(() => {
      props.updateHandler(request_obj)
    }, 1000)

  }, [])

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
          updateHandler={handleUpdate}
          data={props.graph_data}/>
        <div className='status_settings_wrap'>
          <Status_logs settings_type="logs" header="журнал" />
          <Settings_block
            header='настройки'
            items={props.settings_map}
            additional_items={props.settings_map.additional_items ? props.settings_map.additional_items : ''}
            settings_type='status_settings'
            clickHandler={handleClick}
            data={props.settings_data ? props.settings_data : ''}/>
        </div>
      </div>
    </section>
  )
}

export default StatusSection;
