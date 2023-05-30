import React from 'react';
// import ReactDOM from 'react_dom';

import Status_settings from "../status_settings_block"
import Settings_block from '../settings_block'
import Status_logs from "../status_logs_block"
import Status_graphs from "../graph_blocks"

import ModalCalib from '../calib_modal'
import FormInput from '../form_input';

import useGlobalStore from '../../logic/auth_store';
import useSectionStore from '../../logic/sectionsRefs_store';

import './index.css'

export const device_power_table = {
        0: '10',
        1: '50',
        2: '100',
        3: '250',
        4: '300',
        5: '500',
        6: '1000',
        7: '2000',
        8: '5000',
        250: '0'
      },

      device_name_table = {
        0: 'urc',
        1: 'ust',
        2: 'st',
        3: 'bc',
        250: 'unknown'
      }

function StatusSection(props) {
  
  const [authGlobalState, authGlobalActions] = useGlobalStore()
  const [sectionState, sectionActions] = useSectionStore()

  const timerRef = React.useRef();

  const guest_mode_class = !authGlobalState.auth_access.settings ? 'guest_wrap' : ''

  const device_name = device_name_table[props.device_type[0]],
        device_power = device_power_table[props.device_type[1]],
        device_type = `${device_name}_${device_power}`

  const device_status = (status_props) => {
    switch (status_props) {
      case 0:
        return 'ВЫКЛ.'

      case 1:
        return 'ВКЛ.'

      case 3: 
        return 'ЗАБЛОКИРОВАНО'
    
      default:
        break;
    }
  }

  const handleUpdate = request => {
    props.updateHandler(request);
  }

  const handleClick = block_data => {
    block_data.name = props.section_name;
    props.updateHandler(block_data);
  }

  const statusSectionRef = React.useRef(null)


  React.useEffect(() => {

    if (!Array.isArray(props.device_type)) {
      return
    }

    if (props.graph_svg.img.length === 0) {
      let svg_req_str = `${device_type}.svg.gz`
  
      let request_obj = {
        address: 'static/media/status_graph/' + svg_req_str,
        type: 'text',
        notifications: {
          good: 'none',
          bad: 'default'
        },
      }
  
      props.updateHandler(request_obj)
    }

    if (typeof timerRef.current != 'number') {
      handleConnectionRequest()
    }

    let full_log_req_obj = {
      address: 'GetLogErrorFull.cgi',
      data: 'userlog$1'
    }    

    // let status_settings_req_obj = {
    //   address: 'get_transmitter.cgi',
    //   notifications: {
    //     good: 'none',
    //     bad: 'default'
    //   },
    // }  
    
    clearInterval(timerRef.current)

    props.updateHandler(full_log_req_obj)
    // props.updateHandler(status_settings_req_obj)
    
    handleConnectionEstablish()

  }, [props.device_type])

  React.useEffect(() => {
    
    if (props.err_count > 10) {
      clearInterval(timerRef.current)
    } else if (props.err_count == 0 &&
               typeof timerRef.current != 'number' &&
               Array.isArray(props.device_type)) {

      handleConnectionEstablish()
    }
  }, [props.err_count])

  React.useEffect(() => {
    switch (props.pool_state) {
      case 'active':
        if (typeof timerRef.current != 'number') {
          handleConnectionEstablish()
        }

        break;

      case 'blocked':
        clearInterval(timerRef.current)
        break;
    
      default:
        break;
    }
    console.log('pool changed');
  }, [props.pool_state])

  React.useEffect(() => {
    if(statusSectionRef.current != null) {
      console.log(statusSectionRef.current);
      if(sectionState.section_pool.filter(section => section.id === statusSectionRef.current.id).length === 0) {
        sectionActions.add_section_to_pool(statusSectionRef)
      }
    }

    return () => {
      sectionActions.clean_section(`${props.section_name}_section`)
    }
  }, [statusSectionRef])

  const handleConnectionEstablish = () => {
    timerRef.current = setInterval(handleConnectionRequest.bind(props), 1000)
  }

  const handleConnectionRetry = () => {
    props.err_pool_actions.err_erase('status')
    handleConnectionEstablish()
  }

  function handleConnectionRequest() {
    let status_request_obj = {
      address: 'status.cgi',
      fetch_opts: {
        timeout: 1000
      },
      notifications: {
        good: 'none',
        bad: 'none'
      },
    }

    if (props.pool_state === 'active') {
      props.updateHandler(status_request_obj)
    } else {
      console.log('LOCKED');
    }
  }



  return (
    <>
    <section
      id={`${props.section_name}_section`}
      ref={statusSectionRef} >
      <div className="section_header">
        <h2>СТАТУС:&nbsp;
          {props.status_data && device_status(props.status_data.device_status)}
        </h2>
        <span
          style={{textAlign: "right"}}>
          {props.status_data && props.status_data.time}
        </span>
      </div>
      <div className="section_status">
        <Status_graphs
          settings_type="graphs"
          device_type={device_type}
          graph_svg={props.graph_svg.img}
          updateHandler={handleUpdate}
          data={props.graph_data}/>
        <div className={`status_settings_wrap ${guest_mode_class}`}>
          <Status_logs 
            settings_type="logs" 
            header="журнал" 
            data={props.logs_data}
            full_data={props.full_logs_data}
            updateHandler={handleUpdate} />
          {authGlobalState.auth_access.settings &&
          <Status_settings
            updateHandler={handleUpdate}
            section_name={props.section_name}
            settings_data={props.status_data && props.settings_data} 
            status_data={props.status_data}
          />
          }
        </div>
      </div>
    </section>
    {props.err_count > 10 &&
    <DisconnectPlaceholder
      err_pool_actions={props.err_pool_actions}
      connection_retry_handler={handleConnectionRetry} />
    }
    </>
  )
}

function DisconnectPlaceholder({connection_retry_handler, ...rest}) {

  const [isPlaceholderOpen, setIsPlaceholderOpen] = React.useState(false)

  React.useEffect(() => {
    setIsPlaceholderOpen(true)
  }, [])

  const handlePlaceholderClose = (bool) => {
    setIsPlaceholderOpen(bool)
  }

  return (
    <>
    {isPlaceholderOpen &&
    <ModalCalib
      header='соединение потеряно'
      setIsOpen={(e) => {
        setIsPlaceholderOpen(false)
      }}
      user_controllable={false}
      class='full_log_modal hex_upload_modal'>
      <div className='hex_upload_message_wrap'>
        <span className='hex_upload_upload_message'>
          Произошла ошибка соединения. Чтобы продолжить, необходимо повторить попытку соединения
        </span>
        <FormInput
          id={`retry_status_connection_input`}
          name={`retry_status_connection`}
          clickHandler={(e) => {
            connection_retry_handler()
            setIsPlaceholderOpen(false)
          }}
          label='Повторить попытку'
          type="button" />
      </div>
    </ModalCalib>
    }
    </>
  )
}


export default StatusSection;
