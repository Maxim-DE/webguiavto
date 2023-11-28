import React, { useState } from 'react';
import SettingsSectionWrap from '../../../../settings_section_wrap';

import { useSelector } from 'react-redux';
import { reducers } from '../../../../../store/reducers/avr_control_reducers';
import CalibDeviceSwitch from '../../../../calib_device_switch';
import GeneralCalibSettings_AVR from '../../../../settings_block_calib/forms/general_calib_avr';
import SignalCalibSettings from '../../../../settings_block_calib/forms/signal_level_calib';
import SignalThresholdSettings from '../../../../settings_block_calib/forms/signal_threshold_calib';
import SlaveAddGeneralCalib_AVR from '../../../../settings_block_calib/forms/slave_add_general_calib_avr';
import SlaveGeneralCalib_AVR from '../../../../settings_block_calib/forms/slave_general_calib_avr';
import Slave_Rds_general_ from '../../../../settings_block_calib/forms/slave_rds_general_avr';
import PowerCalibSettings_AVR from '../../../../settings_block_calib/forms/wattage_primary_calib_avr';


export const AvrControl = (props) => {
  const [deviceState, setDeviceState] = React.useState(0)

  const calib_store = useSelector((store) => store.globalStore.global_data.section_data?.avr_device_control),
    device_store = calib_store?.[`calib_device_${deviceState}`]


  // const rds_enable = device_store?.slave_general?.rds_enable
  const [rdsEnable, setRdsEnable] = useState(false)

  React.useEffect(() => {
    create_DeviceRequest(deviceState)
  }, [deviceState])
  
  const handleClick = block_data => {
    block_data.data = `avr_device$${deviceState};` + (block_data.data ? block_data.data : '')
    props.updateHandler(block_data);
  }
  
  const create_DeviceRequest = (device_num) => {
    const request_obj = {
      address: `get_avr_device_info.cgi`,
      reducer: reducers.get_avr_device_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }
    
    handleClick(request_obj)
  }

  const device_switch = 
    <CalibDeviceSwitch
      device_num={deviceState}
      deviceNum_handler={setDeviceState}
      clickHandler={props.updateHandler}
      deviceReq_handler={create_DeviceRequest} />

  return (
    <>
      
    <SettingsSectionWrap 
      section_name={`${props.section_name}`}
      section_header="управление устройствами"
      section_subheader={device_switch}>
      <SlaveGeneralCalib_AVR
        calib_state={device_store?.slave_general}
        clickHandler={handleClick}
        rdsHandler={setRdsEnable} />
      <SlaveAddGeneralCalib_AVR
        calib_state={device_store?.slave_add_general}
        clickHandler={handleClick} />
      {rdsEnable == 1 &&
        <Slave_Rds_general_
          section_name="rds_settings"
          calib_state={device_store?.slave_rds}
          clickHandler={handleClick} />
      }
      <GeneralCalibSettings_AVR
        calib_state={device_store?.calib_general}
        clickHandler={handleClick} />
      <PowerCalibSettings_AVR
        calib_state={device_store?.calib_power}
        clickHandler={handleClick} />
      <SignalCalibSettings
        calib_state={device_store?.calib_signal}
        clickHandler={handleClick} />
      <SignalThresholdSettings
        calib_state={device_store?.calib_signal_threshold}
        clickHandler={handleClick} />
    </SettingsSectionWrap>
    </>
  )
}
