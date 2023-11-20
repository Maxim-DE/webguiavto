import React from 'react';

import Settings_block from '../settings_block'
import LoadingSpan from '../loading_span'
import useSectionStore from '../../logic/sectionsRefs_store';

import './index.css'

function SettingsSectionWrap(props) {
  const [sectionStore, sectionActions] = useSectionStore()
  
  const sectionRef = React.useRef(null)
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

  React.useEffect(() => {
    if(sectionRef.current != null) {
      console.log(sectionRef.current);
      if(sectionStore.section_pool.filter(section => section.id === sectionRef.current.id).length === 0) {
        sectionActions.add_section_to_pool(sectionRef)
      }
    }

    return () => {
      sectionActions.clean_section(`${props.section_name}_section`)
    }
  }, [sectionRef])

  // const handleUpdate = data_block => {
  //   // let address = `set_${props.section_name}.cgi`
  //   // block_data.address = address;
  //   props.updateHandler(data_block);
  //   // setSectionState({
  //   //   isLoading: true
  //   // })
  // }

  return (
    <section id={`${props.section_name}_section`} ref={sectionRef}>
      <div className="section_header">
        <h2>
          {props.section_header}
          {/* <LoadingSpan loading={sectionState.isLoading} /> */}
        </h2>
      </div>
      <div className="section_subheader">
        {props.section_subheader}
      </div>
      <div className="section_content">
        {props.children}
      </div>
    </section>
  )
}

export default SettingsSectionWrap;
