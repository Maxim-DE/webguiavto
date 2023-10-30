import React from 'react'

import useGlobalStore from '../../../logic/auth_store'

import GeneralSettingsSection from './sections/general'
import RdsSettingsSection from './sections/rds'
import NetworkSettingsSection from './sections/network'
import InfoSection from './sections/info'
import CalibSection from './sections/calib'

export default function DeviceWrap_RE100(props) {
  const updateHandler = (data_block) => {
    props.updateHandler(data_block)
  }

  const [authGlobalState, authGlobalActions] = useGlobalStore()

  return (
    <>
      <GeneralSettingsSection
        updateHandler={updateHandler}
        // section_data={props.section_data.settings === null ? 'null' : props.section_data.settings}
      />
      <RdsSettingsSection
        updateHandler={updateHandler}
        // section_data={props.section_data.rds === null ? 'null' : props.section_data.rds}
      />
      <NetworkSettingsSection
        updateHandler={updateHandler}
        // section_data={props.section_data.network === null ? 'null' : props.section_data.network}
      />
      <InfoSection
        updateHandler={updateHandler}
        // section_data={props.section_data.info === null ? 'null' : props.section_data.info}
      />
      {authGlobalState.auth_access.calib &&
        <CalibSection
          section_name="calibration"
          section_header="калибровка"
          updateHandler={updateHandler}
          // section_data={props.calib_data === null ? 'null' : props.calib_data}
          adc_data={props.adc_data} />
      }
    </>

  )
}
