import React from 'react'

import SettingsSectionWrap from '../../../../settings_section_wrap'

// import Time_settings from './forms/time_settings'
import Device_address from './forms/device_address';
import Remote_control from './forms/remote_control';
import Snmp_agent from './forms/snmp_agent';
import { reducers } from '../../../../../store/reducers/core_store_reducers';

export default function NetworkSettingsSection(props) {
  
  React.useEffect(() => {
    let request_obj = {
      address: `network.cgi`,
      reducer: reducers.section_data,
      notifications: {
        good: 'none',
        bad: () => {
          return `Ошибка, обновите страницу (network)`
        }

      },
    }
    props.updateHandler(request_obj);

    // setSectionState({
    //   isLoading: true
    // })

  }, [])

  const updateHandler = (data_block) => {
    props.updateHandler(data_block);
  }


  return (
    <SettingsSectionWrap 
      section_name="network"
      section_header="сетевые настройки">
      <Device_address
        section_name="network"
        // settings_data={props.section_data === 'null' ?
        //   'null'
        //   : props.section_data.device_adress}
        clickHandler={updateHandler} />
      <Remote_control
        section_name="network"
        // settings_data={props.section_data === 'null' ?
        //   'null'
        //   : props.section_data.remote_control}
        clickHandler={updateHandler} />
      <Snmp_agent
        section_name="network"
        // settings_data={props.section_data === 'null' ?
        //   'null'
        //   : props.section_data.snmp_agent}
        clickHandler={updateHandler} />
    </SettingsSectionWrap>
  )
}
