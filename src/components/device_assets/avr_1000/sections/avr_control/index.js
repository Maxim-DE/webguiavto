import React, { useState } from 'react';
import SettingsSectionWrap from '../../../../settings_section_wrap';

import { useSelector } from 'react-redux';
import { reducers } from '../../../../../store/reducers/avr_control_reducers';
import CalibDeviceSwitch from '../../../../calib_device_switch';
import SlaveAddGeneralCalib_AVR from '../../../../settings_block_calib/forms/slave_add_general_calib_avr';
import SlaveGeneralCalib_AVR from '../../../../settings_block_calib/forms/slave_general_calib_avr';
import Slave_Rds_general_AVR from '../../../../settings_block_calib/forms/slave_rds_general_avr';
import Slave_scheduler_general_AVR from '../../../../settings_block_calib/forms/slave_scheduler_general_avr';

import { filter_obj } from '../../../../../logic/utilites';


export const AvrControl = (props) => {
  const [deviceState, setDeviceState] = React.useState({
    active_device: 1,
    device_avaliability: {
      device_0: 1,
      device_1: 1,
    }
  })



  const section_store = useSelector((store) => store.globalStore.global_data.section_data?.avr_device_control),
        availiability_store = section_store?.device_avaliability,
        status_device_store = filter_obj(useSelector((store) => store.globalStore.global_data.status_data.status_graph), (key, value) => key.includes('exiter')) ,
        device_store = section_store.device_data?.[`device_${Number(deviceState.active_device)}`]


  // просмотр изменений device_store !! 
  // React.useEffect(() => {
  //   console.log('=== device_store обновился ===');
  //   console.log('device_store:', device_store);
  //   console.log('slave_general:', device_store?.slave_general);
  //   console.log('slave_add_general:', device_store?.slave_add_general);
  //   console.log('scheduler:', device_store?.scheduler);
  // }, [device_store]);  


  // const rds_enable = device_store?.slave_general?.rds_enable
  const [rdsEnable, setRdsEnable] = useState(false)
  const [schedulerEnable, setSchedulerEnable] = useState(false)


  const res_ex_settings_enable = 0
  

  React.useEffect(() => {
    setDeviceState(prevState => ({
      ...prevState,
      device_avaliability: availiability_store
    }))
  }, [availiability_store])
  
  const handleClick = block_data => {
    block_data.data = `avr_device$${Number(deviceState.active_device)};` + (block_data.data ? block_data.data : '')
    props.updateHandler(block_data);
  }

  const device_switch = 
    <CalibDeviceSwitch
      parent_state={deviceState}
      device_avaliability={status_device_store}
      state_handler={setDeviceState}
      clickHandler={props.updateHandler}
      settings_type={res_ex_settings_enable} />

  return (
    <SettingsSectionWrap
      section_name={`${props.section_name}`}
      section_header="управление устройствами"
      section_subheader={device_switch}
    >
        
      {/* блок общие настройки  */}
      <SlaveGeneralCalib_AVR
        calib_state={device_store?.slave_general}
        clickHandler={handleClick}
        rdsHandler={setRdsEnable} 
        schedulerHandler={setSchedulerEnable}
      />

      {/* блок дополнительно  */}
      <SlaveAddGeneralCalib_AVR
        calib_state={device_store?.slave_add_general}  //slave_add_general объект который приходит от сервера
        clickHandler={handleClick}
        rdsHandler={setRdsEnable}
        schedulerHandler={setSchedulerEnable}
      />
      
      {/* блок расписание  */}
      {schedulerEnable == 1 &&
        <Slave_scheduler_general_AVR
          section_name="scheduler_settings"
          // calib_state={device_store?.scheduler}   
          calib_state={device_store?.slave_scheduler}
          clickHandler={handleClick}
        />
      }

      {/* блок rds - общее  */}
      {rdsEnable == 1 &&
        <Slave_Rds_general_AVR
          section_name="rds_settings"
          calib_state={device_store?.slave_rds}  //slave_rds объект который приходит от сервера
          clickHandler={handleClick}
        />
      }



    </SettingsSectionWrap>
  )
}
