import React from 'react';
import ReactDOM from 'react-dom';

import useFetch from '../hooks'

import Settings_block from '../settings_block'
import LoadingSpan from '../loading_span'

import './index.css'

function SettingsSection(props) {
  const [sectionState, setSectionState] = React.useState({
    isLoading: false
  });

  React.useEffect(() => {
    if (props.section_data) {
      setSectionState({
        isLoading: false
      })
    }
  }, [props.section_data]);

  React.useEffect(() => {
    let request_obj = {
      address: `${props.section_name}.cgi`,
    }
    props.updateHandler(request_obj);

    setSectionState({
      isLoading: true
    })
  }, [])

  const handleClick = block_data => {
    let address = `set_${props.section_name}.cgi`
    block_data.address = address;
    props.updateHandler(block_data);
    setSectionState({
      isLoading: true
    })
  }

  return (
    <section id={`${props.section_name}_section`}>
      <div className="section_header">
        <h2>
          {props.section_header}
          <LoadingSpan loading={sectionState.isLoading} />
        </h2>
      </div>
      <div className="section_content">
        {
          props.blocks.map((item, index) => {
            return (
              <Settings_block
                header={item.settings_header}
                items={item.settings_items == 'custom' ? [{type: 'custom'}] : item.settings_items}
                additional_items={
                  item.additional_items == null ? '' :
                  item.additional_items == 'custom' ? [{type: 'custom'}] : item.additional_items}
                settings_type={item.settings_type}
                clickHandler={handleClick}
                data={
                  props.section_data ? props.section_data[item.settings_type] : ''
                }
                section_name={props.section_name}
              />
            );
          })
        }
      </div>
    </section>
  )
}

export default SettingsSection;
