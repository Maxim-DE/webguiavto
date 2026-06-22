import React from 'react'

import SettingsSectionWrap from '../../../../settings_section_wrap'

// import Time_settings from './forms/time_settings'
import Info_general from './forms/info_general';
import Info_amplifire from './forms/info_amplifire';
import Info_exiter from './forms/info_exiter';
import Info_cap from './forms/info_cap';
import Software_version from './forms/software_version';
import { reducers } from '../../../../../store/reducers/core_store_reducers';
import Reset_Info from './forms/reset';
import { useSelector } from 'react-redux';

export default function InfoSection(props) {
  const auth_store = useSelector((store) => store.authStore.auth_data)

  React.useEffect(() => {
    let request_obj = {
      address: `info.cgi`,
      reducer: reducers.section_data,
      notifications: {
        good: 'none',
        bad: () => {
          return `Ошибка, обновите страницу (info)`
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
      section_name="info"
      section_header="данные об устройстве">
      <Info_general
        section_name="info"
        // settings_data={props.section_data === 'null' ?
        //   'null'
        //   : props.section_data.info_general}
        clickHandler={updateHandler} />
      <Software_version
        section_name="info"
        // settings_data={props.section_data === 'null' ?
        //   'null'
        //   : props.section_data.software_version}
        clickHandler={updateHandler} />
      <Info_exiter 
        section_name="info"
        clickHandler={updateHandler} />
      <Info_cap 
        section_name="info"
        clickHandler={updateHandler} />
      <Info_amplifire 
        section_name="info"
        clickHandler={updateHandler} />
      {auth_store.auth_access.calib_extend &&
        <Reset_Info
          section_name="reset"
          clickHandler={updateHandler} />
      }
    </SettingsSectionWrap>
  )
}
