import React from 'react'

import RecoverSection from './sections/recover'

export default function DeviceWrap_unknown(props) {
  
  const updateHandler = (data_block) => {
    props.updateHandler(data_block)
  }

  return (
    <>
    <RecoverSection
      section_name="recover"
      section_header=""
      updateHandler={updateHandler} />
    </>
    
  )
}