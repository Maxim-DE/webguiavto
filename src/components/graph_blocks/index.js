import React from 'react';
import ReactDOM from 'react-dom';

import { PulseLoader } from 'react-spinners';

import './index.css'
import svg_editing_logic from '../../logic/svg_editing_logic';
import { allEventListenersInNode } from '../../logic/utilites';
import svg_eventHandler_logic from '../../logic/svg_eventHandlers_logic';

export const status_colors = [
  '#ABE188', //good
  '#f9c22e', //warning
  '#fe5f55', //error
  '#68CEDE', //hibernation
]

export const new_status_colors = {
  0: '#68CEDE', // OFF
  1: '#ABE188', // ON
  2: '#fe5f55', // LOCK(ERROR)
  4: '#f9c22e', // TURN_ON
  100: '#8D8D92' // DISCONNECT
}

function Status_graphs(props) {

  const graph_container_ref = React.useRef(null)

  const active_control_mode = props.device_info?.active_control_mode,
        current_signal_path = props.device_info?.current_signal_path

  React.useEffect(() => {
    svg_processing(graph_container_ref.current, props.data)
  }, [props.data, active_control_mode, current_signal_path])


  React.useEffect(() => {
    
    let graph_container = graph_container_ref.current
    
    if (!props.graph_svg) {
      return
    } 

    graph_container.innerHTML = ''

    let parsed_svg = new DOMParser().parseFromString(props.graph_svg, "text/xml").childNodes[0]

    const edited_svg = svg_eventHandler_logic(parsed_svg, {}, props.device_type_str, props.updateHandler)

    graph_container.append(edited_svg);

  }, [props.graph_svg])


  function svg_processing(svg_ref, svg_data) {
    let graph_svg_container = svg_ref
    let graph_data = svg_data

    if (!graph_svg_container) {
      console.error("Can't find svg ref container!")
      return
    }

    if (!graph_svg_container.children[0]) {
      return
    }

    // let graph_svg = graph_svg_container.children[0].cloneNode(true)
    let graph_svg = graph_svg_container.children[0]

    if (graph_svg == null ||
        graph_svg == '') {
      console.error("Can't find svg image in container!")
      
      return
    }

    for (const key in graph_data) {
      let graph_block = graph_svg.querySelector(`#${key}`)
      let graph_block_data = graph_data[key]

      if (graph_block === null) {
        console.error("Can't find svg device block with key: " + key)
        continue;
      }

      for (const item in graph_block_data) {

        if (item == "status") {
          let device_icon = graph_block.querySelector(`#${key}_device_icon`)
          // console.log("device_icon: ",device_icon)
          if (!device_icon) {
            console.error("Can't find device icon with key: " + key)
            // debugger  
            continue;
          }

          device_icon.style.fill = new_status_colors[`${graph_block_data[item]}`]

          continue
        }

        let graph_block_value_span_id = `#${key}_${item}_value`
        let graph_block_value_span = null

        if (graph_block_value_span_id == undefined) {
          console.error("Can't get value span id with item: " + item)
          continue
        }

        try {
          graph_block_value_span = graph_block.querySelector(graph_block_value_span_id).children[0]
        } catch (error) {
          // console.warn("Can't get value span with id: " + graph_block_value_span_id)
          continue
        }



        let new_value

        if (Array.isArray(graph_block_data[item])) {
          let input_value = graph_block_data[item][0],
            divider, 
            status = graph_block_data[item][2],
            postfix = graph_block_data[item][3] ?
              ' ' + graph_block_data[item][3] :
              '',
            round_index

          if (Array.isArray(input_value)) {
            const result_arr = input_value.map((val_instance, val_index) => {
              const arr_val = val_instance[0] ?? 255

              divider = val_instance[1] ?? 1
              round_index = Math.log10(divider)
              postfix = val_instance[2] ?? postfix

              return (arr_val / divider).toFixed(round_index) + ' ' + postfix
            })
            new_value = result_arr.join(' / ')

          } else if (typeof input_value == 'string') {
            new_value = input_value
            

          } else {
            divider = graph_block_data[item][1] != 0 ? graph_block_data[item][1] : 1,
            round_index = Math.log10(divider)
  
            new_value = (input_value / divider).toFixed(round_index)
            new_value = new_value + postfix
          }

          if (status != 0) {
            graph_block_value_span.style.fontWeight = "500";
            graph_block_value_span.style.fill = status_colors[status];
          } else {
            graph_block_value_span.style.fontWeight = "300";
            // graph_block_value_span.attributes["font-weight"].value = "300";
            graph_block_value_span.style.fill = '#202020';
          }


        } else {
          graph_block_value_span.style.fontWeight = "300";
          new_value = graph_block_data[item]
        }

        graph_block_value_span.innerHTML = new_value
      }
    }

    let edited_svg = svg_editing_logic(graph_svg, graph_data, props.device_type_str, props.updateHandler, props.auth_access)

    // graph_svg_container.innerHTML = ''
    // graph_svg_container.append(edited_svg)
  }

  if (props.graph_svg.length === 0) {
    return (
      <div className="hex_upload_message_wrap">
        <PulseLoader
          color="#bbcacf"
          loading
          margin={9}
          size={13}
          speedMultiplier={0.5}
        />
      </div>
    )
  } else {
    return (
      <div className="graphs" ref={graph_container_ref} />
    )
  }

}

export default Status_graphs;
