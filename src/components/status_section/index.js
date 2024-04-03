import React from 'react';
// import ReactDOM from 'react_dom';

import { IoMdPower } from "react-icons/io";

import Status_settings from "../status_settings_block"
import Status_logs from "../status_logs_block"
import Status_graphs from "../graph_blocks"

import FormInput from '../form_input';

import useGlobalStore from '../../logic/auth_store';
import useSectionStore from '../../logic/sectionsRefs_store';

import './index.css'
import { reducers } from '../../store/reducers/status_section_reducers';
import { reducers as calib_reducers } from '../../store/reducers/calib_forms_reducers';
import { reducers as core_reducers } from '../../store/reducers/core_store_reducers';
import { useDispatch, useSelector } from 'react-redux';
import { device_status } from '../../logic/utilites';
import { err_erase } from '../../store/errPool_store_slice';
import { AlertDialogWrap } from '../alert_dialog_wrap';

export const device_model_table = {
  'УРЦ-1000': 're_amp_1000',
  'УРЦ-2000': 're_amp_2000',
  'УСТ-250': 'st_amp_250',
  'УСТ-500': 'st_amp_500'
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
  const magicNumber_ref = React.useRef(undefined)

  const guest_mode_class = !auth_store.auth_access.settings ? 'guest_wrap' : ''

  let device_type_arr = [],
      device_type = 0,
      device_type_str = ''

  if (section_store.info.info_general) {
    device_type_arr = section_store.info.info_general.device_type_list ? section_store.info.info_general.device_type_list : [],
    device_type = section_store.info.info_general.model ? section_store.info.info_general?.model : 0
    device_type_str = device_type_arr[device_type]
  }

  // const device_type_arr = Object.keys(section_store.info).length > 0 ? section_store.info.info_general.device_type_list : '',
  //       device_type = Object.keys(section_store.info).length > 0 ? section_store.info.info_general.model : 0,
  //       device_type_str = device_type_arr[device_type]


  const device_status_output = Object.keys(status_store).length > 0 && device_status(status_store.status_info.device_status),
        device_time_output = Object.keys(status_store).length > 0 && status_store.status_info.time,
    device_def_module_status = Object.keys(status_store).length > 0 && status_store?.calib_info?.def_module_status

  const status_magic_number = Object.keys(status_store).length > 0 && status_store.status_info?.magic_number


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
      if (device_type_arr.length === 0 || device_type === 255) return

      let svg_req_str = `${device_model_table[device_type_str]}.svg.gz`
  
      let request_obj = {
        address: 'get_status_image.cgi',
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

  React.useEffect(() => {
    dispatch(err_erase('status'))

    if (status_magic_number != undefined && typeof magicNumber_ref.current == "number") {
      let request_obj = {
        address: `info.cgi`,
        reducer: core_reducers.section_data,
        notifications: {
          good: 'none',
          bad: 'none'
        },
      }
  
      props.updateHandler(request_obj);

      magicNumber_ref.current = status_magic_number
    }
    
    if (typeof status_magic_number == "number" && magicNumber_ref.current == undefined) {
      magicNumber_ref.current = status_magic_number
    }


  }, [status_magic_number])

  const handleConnectionEstablish = () => {
    timerRef.current = setInterval(handleConnectionRequest.bind(props), 1000)
  }

  const handleConnectionRetry = () => {
    dispatch(err_erase('status'))

    let request_obj = {
      address: `info.cgi`,
      reducer: core_reducers.section_data,
      notifications: {
        good: 'none',
        bad: 'none'
      },
    }

    props.updateHandler(request_obj);

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

  const turn_def_module_on = () => {
    const request_obj = {
      address: 'calib_general.cgi',
      data: `def_module$1`,
      reducer: calib_reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_general: {
          def_module: 1
        }
      }
    }

    props.updateHandler(request_obj)

    const info_request_obj = {
      address: `info.cgi`,
      reducer: core_reducers.section_data,
      notifications: {
        good: 'none',
        bad: 'none'
      },
    }

    props.updateHandler(info_request_obj);
  }


  return (
    <>
    <section
      id={`${props.section_name}_section`}
      ref={statusSectionRef} >
      <div className="section_header">
        <div className="header_info_wrap">
          <h2>СТАТУС:&nbsp;
            {device_status_output}
          </h2>
          {!device_def_module_status &&
            <h3 className='status_info_subheader'>
              ЗАЩИТА:&nbsp;
              <div className="def_module_switch">
                <span className="def_module_status">
                  {device_def_module_status ? "ВКЛ." : "ВЫКЛ"}
                </span>
                <div className="vertical_li_divider"></div>
                <button 
                  className='def_module_switch_button' 
                  type="button"
                  title='Включить модуль защиты'
                  onClick={turn_def_module_on}>
                  <IoMdPower
                    color='#2B2927'
                    size={25}  />
                </button>
              </div>
            </h3>
          }
        </div>
        <span
          style={{textAlign: "right"}}>
          {device_time_output}
        </span>
      </div>
      <div className="section_header">
      </div>
      <div className="section_status">
        <Status_graphs
          settings_type="graphs"
          device_type={device_type}
          device_type_str={device_type_str}
          graph_svg={status_store.status_svg.img}
          auth_access={auth_store.auth_access}
          updateHandler={handleUpdate}
          data={status_store.status_graph}/>
        <div className={`status_settings_wrap guest_wrap`}>
          <Status_logs 
            settings_type="logs" 
            header="журнал" 
            data={status_store.status_logs}
            full_data={status_store.status_full_logs}
            updateHandler={handleUpdate} />
          {/* {auth_store.auth_access.settings &&
          <Status_settings
            updateHandler={handleUpdate}
            device_type={device_type}
            section_name={props.section_name}
            settings_data={Object.keys(status_store.status_settings).length > 0 && status_store.status_settings}
            status_data={status_store}
          />
          } */}
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
    <AlertDialogWrap
      open={isPlaceholderOpen}
      title='соединение потеряно'
      onClose={(e) => {
        setIsPlaceholderOpen(false)
      }}
      >
      <span className='hex_upload_upload_message'>
        Произошла ошибка соединения. Чтобы продолжить, необходимо повторить попытку соединения.
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
    </AlertDialogWrap>
    }
    </>
  )
}


export default StatusSection;
