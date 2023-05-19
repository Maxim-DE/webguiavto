import React from 'react';

import Settings_block from '../settings_block'
import LoadingSpan from '../loading_span'

import './index.css'

function SettingsSectionWrap(props) {
  // const [sectionState, setSectionState] = React.useState({
  //   isLoading: false
  // });

  // React.useEffect(() => {
  //   // if (props.section_data) {
  //   //   setSectionState({
  //   //     isLoading: false
  //   //   })
  //   // }
  // }, [props.section_data]);

  // React.useEffect(() => {
  //   let request_obj = {
  //     address: `${props.section_name}.cgi`,
  //     notifications: {
  //       good: 'none',
  //       bad: () => {
  //         return `Ошибка, обновите страницу (${props.section_name})`
  //       }
        
  //     },
  //   }

  //   props.updateHandler(request_obj);

  //   // setSectionState({
  //   //   isLoading: true
  //   // })
  // }, [])

  // const handleUpdate = data_block => {
  //   // let address = `set_${props.section_name}.cgi`
  //   // block_data.address = address;
  //   props.updateHandler(data_block);
  //   // setSectionState({
  //   //   isLoading: true
  //   // })
  // }

  return (
    <section id={`${props.section_name}_section`}>
      <div className="section_header">
        <h2>
          {props.section_header}
          {/* <LoadingSpan loading={sectionState.isLoading} /> */}
        </h2>
      </div>
      <div className="section_content">
        {props.children}
      </div>
    </section>
  )
}

export default SettingsSectionWrap;
