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
import { dataArray_to_string } from '../../../../../logic/request_logic';
import PowerCalibThreshold_AVR from '../../../../settings_block_calib/forms/wattage_threshold_calib_avr';
import { deepKeyExists } from '../../../../../logic/utilites';


export const AvrDevicesCalib = (props) => {
  const [deviceState, setDeviceState] = React.useState({
    active_device: 0,
    device_avaliability: {
      device_0: 1,
      device_1: 1,
      device_2: 1,
      device_3: 1,
    }
  })

  const section_store = useSelector((store) => store.globalStore.global_data.section_data?.avr_device_control),
        adc_store = useSelector((store) => store.globalStore.global_data.status_data.calib_adc),
        availiability_store = section_store?.device_avaliability,
        device_store = section_store.device_data?.[`device_${Number(deviceState.active_device) + 1}`],
        adc_device_store = adc_store?.[`device_${Number(deviceState.active_device) + 1}`]


  // const rds_enable = device_store?.slave_general?.rds_enable
  const [rdsEnable, setRdsEnable] = useState(false)
  const res_ex_settings_enable = 1

  React.useEffect(() => {
    const request_obj = {
      address: `get_avr_device_availiable.cgi`,
      reducer: reducers.get_avr_device_availability,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.updateHandler(request_obj);
  }, [])

  React.useEffect(() => {
    setDeviceState(prevState => ({
      ...prevState,
      device_avaliability: availiability_store
    }))
  }, [availiability_store])
  
  const handleClick = block_data => {
    block_data.data = `avr_device$${Number(deviceState.active_device)+1};` + (block_data.data ? block_data.data : '')
    props.updateHandler(block_data);
  }

  const device_switch = 
    <CalibDeviceSwitch
      parent_state={deviceState}
      state_handler={setDeviceState}
      clickHandler={props.updateHandler}
      settings_type={res_ex_settings_enable} />

  return (
    <>
      
    <SettingsSectionWrap 
      section_name={`${props.section_name}`}
      section_header="управление каналами"
      section_subheader={device_switch}>
      {/* <SlaveGeneralCalib_AVR
        calib_state={device_store?.slave_general}
        clickHandler={handleClick}
        rdsHandler={setRdsEnable} />
      <SlaveAddGeneralCalib_AVR
        calib_state={device_store?.slave_add_general}
        clickHandler={handleClick} 
        rdsHandler={setRdsEnable} />
      {rdsEnable == 1 &&
        <Slave_Rds_general_
          section_name="rds_settings"
          calib_state={device_store?.slave_rds}
          clickHandler={handleClick} />
      } */}
      {/* <GeneralCalibSettings_AVR
        calib_state={device_store?.calib_general}
        clickHandler={handleClick} /> */}
      <PowerCalibSettings_AVR
        calib_state={device_store?.calib_power}
        clickHandler={handleClick}
        adc_store={adc_device_store?.power_calib} />
      <SignalCalibSettings
        calib_state={device_store?.calib_signal}
        clickHandler={handleClick} />
      <SignalThresholdSettings
        calib_state={device_store?.calib_signal_threshold}
        clickHandler={handleClick} />
      <PowerCalibThreshold_AVR
        calib_state={device_store?.calib_power_threshold}
        clickHandler={handleClick} />
      {deviceState.device_avaliability[`device_${deviceState.active_device}`] == 0 &&
        <div className='content_unavailiable' >
          <div className='centered'>
            <div className='modal alert_modal'>
                <div className='alert_message_wrap'>
                  Устройство недоступно.
                </div>
            </div>
          </div>
        </div>
      }
    </SettingsSectionWrap>
    </>
  )
}
