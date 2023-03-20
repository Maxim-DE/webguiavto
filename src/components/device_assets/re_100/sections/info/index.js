import React from 'react'

import SettingsSectionWrap from '../../../../settings_section_wrap'

// import Time_settings from './forms/time_settings'
import Info_general from './forms/info_general';
import Software_version from './forms/software_version';

export default function InfoSection(props) {

  React.useEffect(() => {
    let request_obj = {
      address: `info.cgi`,
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
        settings_data={props.section_data === 'null' ?
          'null'
          : props.section_data.info_general}
        clickHandler={updateHandler} />
      <Software_version
        section_name="info"
        settings_data={props.section_data === 'null' ?
          'null'
          : props.section_data.software_version}
        clickHandler={updateHandler} />
    </SettingsSectionWrap>
  )
}