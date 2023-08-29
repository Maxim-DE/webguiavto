import React from 'react'

import SettingsSectionWrap from '../../../../settings_section_wrap'

import Rds_general_settings from './forms/rds_general_settings'
import { reducers } from '../../../../../store/reducers/core_store_reducers'

export default function RdsSettingsSection(props) {

  React.useEffect(() => {
    let request_obj = {
      address: `rds.cgi`,
      reducer: reducers.section_data,
      notifications: {
        good: 'none',
        bad: () => {
          return `Ошибка, обновите страницу (rds)`
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
      section_name="rds_settings"
      section_header="rds-настройки">
      <Rds_general_settings
        section_name="rds_settings"
        // settings_data={props.section_data === 'null' ?
        //   'null'
        //   : props.section_data.rds_general_settings}
        clickHandler={updateHandler} />
    </SettingsSectionWrap>
  )
}