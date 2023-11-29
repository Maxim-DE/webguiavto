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
import { reducers } from '../../store/reducers/status_section_reducers';
import { reducers as statusLogs_reducers } from '../../store/reducers/status_logs_reducers';
import { useDispatch, useSelector } from 'react-redux';
import { device_status } from '../../logic/utilites';
import { err_erase } from '../../store/errPool_store_slice';

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
        0: 'ust',
        1: 'urc',
        2: 'st',
        3: 're',
        4: 'bc',
        250: 'unknown'
      }

function StatusSection(props) {
  
  const [authGlobalState, authGlobalActions] = useGlobalStore()
  const [sectionState, sectionActions] = useSectionStore()

  const status_store = useSelector((store) => store.globalStore.global_data.status_data),
        section_store = useSelector((store) => store.globalStore.global_data.section_data),
        errPool_store = useSelector((store) => store.errPoolStore.err_pool),
        auth_store = useSelector((store) => store.authStore.auth_data),
        dispatch = useDispatch()

  const timerRef = React.useRef()

  const guest_mode_class = !auth_store.auth_access.settings ? 'guest_wrap' : ''

  const device_type_arr = Object.keys(section_store.info).length > 0 ? section_store.info.info_general.type : '',
        device_name = device_name_table[device_type_arr[0]],
        device_power = device_power_table[device_type_arr[1]],
        device_type = `${device_name}_${device_power}`


  const device_status_output = Object.keys(status_store).length > 0 && device_status(status_store.status_info.device_status),
        device_time_output = Object.keys(status_store).length > 0 && status_store.status_info.time


  const handleUpdate = request => {
    props.updateHandler(request);
  }

  const handleClick = block_data => {
    block_data.name = props.section_name;
    props.updateHandler(block_data);
  }

  const statusSectionRef = React.useRef(null)


  React.useEffect(() => {

    if (!Array.isArray(device_type_arr)) {
      return
    }

    if (status_store.status_svg.img.length === 0) {
      let svg_req_str = `${device_type}.svg.gz`
  
      let request_obj = {
        address: 'static/media/status_graph/' + svg_req_str,
        type: 'text',
        reducer: reducers.get_status_graph,
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

    // let full_log_req_obj = {
    //   address: 'GetLogErrorFull.cgi',
    //   data: 'userlog$1',
    //   reducer: statusLogs_reducers.userlog_data
    // }    

    // let status_settings_req_obj = {
    //   address: 'get_transmitter.cgi',
    //   notifications: {
    //     good: 'none',
    //     bad: 'default'
    //   },
    // }  
    
    clearInterval(timerRef.current)

    // props.updateHandler(full_log_req_obj)
    // props.updateHandler(status_settings_req_obj)
    
    handleConnectionEstablish()

  }, [device_type_arr])

  React.useEffect(() => {
    
    if (errPool_store.status_err_count > 10) {
      clearInterval(timerRef.current)
    } else if (errPool_store.status_err_count == 0 &&
               typeof timerRef.current != 'number' &&
               Array.isArray(device_type_arr)) {

      handleConnectionEstablish()
    }
  }, [errPool_store.status_err_count])

  React.useEffect(() => {
    switch (props.pool_state) {
      case 'active':
        if (timerRef.current == -1) {
          handleConnectionEstablish()
        }

        break;

      case 'blocked':
        clearInterval(timerRef.current)
        timerRef.current = -1
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
    dispatch(err_erase('status'))
    handleConnectionEstablish()
  }

  function handleConnectionRequest() {
    let status_request_obj = {
      address: 'status.cgi',
      fetch_opts: {
        timeout: 1000
      },
      reducer: reducers.status_section,
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
          {device_status_output}
        </h2>
        <span
          style={{textAlign: "right"}}>
          {device_time_output}
        </span>
      </div>
      <div className="section_status">
        <Status_graphs
          settings_type="graphs"
          device_type={device_type}
          graph_svg={status_store.status_svg.img}
          updateHandler={handleUpdate}
          data={status_store.status_graph}/>
        <div className={`status_settings_wrap ${guest_mode_class}`}>
          <Status_logs 
            settings_type="logs" 
            header="журнал" 
            data={status_store.status_logs}
            full_data={status_store.status_full_logs}
            updateHandler={handleUpdate} />
          {auth_store.auth_access.settings &&
          <Status_settings
            updateHandler={handleUpdate}
            device_type={device_type}
            section_name={props.section_name}
            settings_data={Object.keys(status_store.status_settings).length > 0 && status_store.status_settings}
            status_data={status_store}
          />
          }
        </div>
      </div>
    </section>
    {errPool_store.status_err_count > 10 &&
    <DisconnectPlaceholder
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
