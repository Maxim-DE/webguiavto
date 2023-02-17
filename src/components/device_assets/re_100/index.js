import React from 'react'

import GeneralSettingsSection from './sections/general'
import RdsSettingsSection from './sections/rds'
import NetworkSettingsSection from './sections/network'
import InfoSection from './sections/info'

export default function DeviceWrap_RE100(props) {
  const updateHandler = (data_block) => {
    props.updateHandler(data_block)
  }

  return (
    <>
      <GeneralSettingsSection
        updateHandler={updateHandler}
        section_data={props.sectionData.settings === null ? 'null' : props.sectionData.settings}
      />
      <RdsSettingsSection
        updateHandler={updateHandler}
        section_data={props.sectionData.rds === null ? 'null' : props.sectionData.rds}
      />
      <NetworkSettingsSection
        updateHandler={updateHandler}
        section_data={props.sectionData.network === null ? 'null' : props.sectionData.network}
      />
      <InfoSection
        updateHandler={updateHandler}
        section_data={props.sectionData.info === null ? 'null' : props.sectionData.info}
      />
    </>

  )
}
