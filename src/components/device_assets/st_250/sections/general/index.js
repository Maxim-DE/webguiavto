import React from 'react'

import SettingsSectionWrap from '../../../../settings_section_wrap'

import Time_settings from './forms/time_settings'

export default function GeneralSettingsSection(props) {

  const updateHandler = (data_block) => {
    props.updateHandler(data_block);
  }

  React.useEffect(() => {
    let request_obj = {
      address: `settings.cgi`,
      notifications: {
        good: 'none',
        bad: () => {
          return `Ошибка, обновите страницу (settings)`
        }

      },
    }
    props.updateHandler(request_obj);

    // setSectionState({
    //   isLoading: true
    // })

  }, [])

  return (
    <SettingsSectionWrap 
      section_name="settings"
      section_header="общие настройки">
      <Time_settings 
        section_name="settings"
        settings_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.time_settings : ''}
        clickHandler={updateHandler} />
    </SettingsSectionWrap>
  )
}
