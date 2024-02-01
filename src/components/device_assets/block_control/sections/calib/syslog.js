import React from 'react'
import SettingsSectionWrap from '../../../../settings_section_wrap'

import { useSelector } from 'react-redux';
import { reducers } from '../../../../../store/reducers/core_store_reducers';
import SyslogSection_calib from '../../../../settings_block_calib/forms/syslog_section';
import { deepKeyExists } from '../../../../../logic/utilites';

export const SyslogCalib = (props) => {
  const calibMisc_store = useSelector((store) => {
    if (deepKeyExists(store, 'calib_misc')) {
      return store.globalStore.global_data.calib_state.data?.calib_misc
    } else return {}
  }),
        auth_store = useSelector((store) => store.authStore.auth_data)

  React.useEffect(() => {
    let request_obj = {
      address: `calibration.cgi`,
      reducer: reducers.calibration_data,
    }
    props.updateHandler(request_obj);
  }, [])

  const handleClick = block_data => {
    props.updateHandler(block_data);
  }

  return (
    <SettingsSectionWrap 
      section_name={`${props.section_name}`}
      section_header="Системный журнал"
      grid_columns='1'>
        <SyslogSection_calib
          updateHandler={handleClick}
          logData={calibMisc_store?.sys_log} />
    </SettingsSectionWrap>
  )
}
