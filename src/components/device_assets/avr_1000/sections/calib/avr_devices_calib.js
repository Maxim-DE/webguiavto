import React, { useEffect, useRef, useState } from 'react';
import SettingsSectionWrap from '../../../../settings_section_wrap';
import { useSelector } from 'react-redux';
import { reducers } from '../../../../../store/reducers/avr_control_reducers';
import CalibDeviceSwitch from '../../../../calib_device_switch';
import GeneralCalibSettings_AVR from '../../../../settings_block_calib/forms/general_calib_avr';
import SignalCalibSettings from '../../../../settings_block_calib/forms/signal_level_calib';
import SignalThresholdSettings from '../../../../settings_block_calib/forms/signal_threshold_calib';
import PowerCalibSettings_AVR from '../../../../settings_block_calib/forms/wattage_primary_calib_avr';
import { dataArray_to_string } from '../../../../../logic/request_logic';
import PowerCalibThreshold_AVR from '../../../../settings_block_calib/forms/wattage_threshold_calib_avr';
import { deepKeyExists, filter_obj } from '../../../../../logic/utilites';
import MainsVoltageCalib_AVR from '../../../../settings_block_calib/forms/mains_voltage_calib_avr'; // Добавленный импорт
// import { setauth_level, setIsAuth, setUserId } from "../auth_store_slice";


export const AvrDevicesCalib = (props) => {
  const [deviceState, setDeviceState] = React.useState({
    active_device: 1,
    device_avaliability: {
      device_0: 1,
      device_1: 1,
    }
  });

  const section_store = useSelector((store) => store.globalStore.global_data.section_data?.avr_device_control);
  const adc_store = useSelector((store) => store.globalStore.global_data.status_data.calib_adc);
  const availiability_store = section_store?.device_avaliability;
  const status_device_store = filter_obj(
    useSelector((store) => store.globalStore.global_data.status_data.status_graph),
    (key, value) => key.includes('exiter')
  );
  const res_input_device_state = filter_obj(
    useSelector((store) => store.globalStore.global_data.status_data.status_graph),
    (key, value) => key.includes('input_0')
  );
  const device_store = section_store.device_data?.[`device_${Number(deviceState.active_device)}`];
  const adc_device_store = adc_store?.[`device_${Number(deviceState.active_device)}`];

  const res_ex_settings_enable = useRef(0);
  
  // Получаем уровень авторизации из Redux store
  const auth_level = useSelector((store) => store.authStore.auth_data.auth_level)
  useEffect(() => {
    setDeviceState(prevState => ({
      ...prevState,
      device_avaliability: availiability_store
    }));
  }, [availiability_store]);

  const handleClick = block_data => {
    block_data.data = `avr_device$${Number(deviceState.active_device)};` + (block_data.data ? block_data.data : '');
    props.updateHandler(block_data);
  };

  const device_switch = (
    <CalibDeviceSwitch
      parent_state={deviceState}
      device_avaliability={status_device_store}
      state_handler={setDeviceState}
      clickHandler={props.updateHandler}
      settings_type={1}
    />
  );

  return (
    <>
      <SettingsSectionWrap
        section_name={`${props.section_name}`}
        section_header="управление каналами"
        section_subheader={device_switch}
      >
       {/* Новая вкладка калибровки напряжения сети - показывается только при уровне авторизации 3 */}
       {auth_level == 3 && (
        <MainsVoltageCalib_AVR
          calib_state={device_store?.calib_mains_voltage}  // ← исправлено: calib_mains_voltage вместо mains_voltage_calib
          clickHandler={handleClick}
          adc_store={adc_device_store?.power_calib}  // ← исправлено
          section_name={props.section_name}
        />
       )}  
        <PowerCalibSettings_AVR
          calib_state={device_store?.calib_power}
          clickHandler={handleClick}
          adc_store={adc_device_store?.power_calib}
        />
        {deviceState.active_device != 0 && (
          <>
            <PowerCalibThreshold_AVR
              calib_state={device_store?.calib_power_threshold}
              clickHandler={handleClick}
            />
            <SignalCalibSettings
              calib_state={device_store?.calib_signal}
              clickHandler={handleClick}
              active_device={deviceState.active_device}
              is_res_ex_available={res_ex_settings_enable.current}
              adc_store={adc_device_store?.signal_calib}
            />
            <SignalThresholdSettings
              calib_state={device_store?.calib_signal_threshold}
              clickHandler={handleClick}
            />
          </>
        )}
      </SettingsSectionWrap>
    </>
  );
};