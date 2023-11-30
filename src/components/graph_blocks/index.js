import React from 'react';
import ReactDOM from 'react-dom';

import { PulseLoader } from 'react-spinners';

import './index.css'
import svg_editing_logic from '../../logic/svg_editing_logic';


export const status_colors = [
  '#ABE188', //good
  '#f9c22e', //warning
  '#fe5f55', //error
  '#68CEDE', //hibernation
]

function Status_graphs(props) {

  const graph_container_ref = React.useRef(null)

  React.useEffect(() => {
    let graph_svg_container = graph_container_ref.current
    let graph_data = props.data
    
    if (!graph_svg_container) {
      return
    }
    
    let graph_svg = graph_svg_container.children[0]
    
    if (graph_svg == null ||
        graph_svg == '') {
      return
    }

    let edited_svg = svg_editing_logic(graph_svg, graph_data, props.device_type_str)

    for (const key in graph_data) {
      let graph_block = graph_svg.querySelector(`#${key}`)
      let graph_block_data = graph_data[key]

      if (graph_block === null) {
        continue;
      }

      for (const item in graph_block_data) {
        
        if (item == "status") {
          let device_icon = graph_block.querySelector(`#${key}_device_icon`)

          device_icon.style.fill = status_colors[graph_block_data[item]]
          
          continue
        }
        
        let graph_block_value_span_id = `#${key}_${item}_value`
        let graph_block_value_span = null

        if (graph_block_value_span_id == undefined) {
          continue
        }

        try {
          graph_block_value_span = graph_block.querySelector(graph_block_value_span_id).children[0]
        } catch (error) {
          continue
        }

        
        
        let new_value

        if (Array.isArray(graph_block_data[item])) {
          let input_value = graph_block_data[item][0],
              divider = graph_block_data[item][1] != 0 ? graph_block_data[item][1] : 1,
              status = graph_block_data[item][2],
              postfix = graph_block_data[item][3] ? 
                        ' ' + graph_block_data[item][3] :
                        ''                        ,

              fract = (input_value / divider) % 1,
              round_index

          round_index = Math.log10(divider)

          // if (fract < 0.1 &&
          //     fract > 0) {
          //   round_index = 2
          // } else if (fract == 0) {
          //   round_index = 0
          // } else {
          //   round_index = 1
          // }

          new_value = (input_value / divider).toFixed(round_index)
          new_value = new_value + postfix

          if (status != 0) {
            graph_block_value_span.style.fontWeight = "500";
            graph_block_value_span.style.fill = status_colors[status];
          } else {
            graph_block_value_span.style.fontWeight = "300";
            // graph_block_value_span.attributes["font-weight"].value = "300";
            graph_block_value_span.style.fill = '#202020';
          }
          

        } else {
          new_value = graph_block_data[item]
        }

        graph_block_value_span.innerHTML = new_value


      }
    }

    edited_svg = svg_editing_logic(graph_svg, graph_data, props.device_type_str)
    
  }, [props.data])

  React.useEffect(() => {
    if (!props.graph_svg) {
      return
    } 

    let graph_container = graph_container_ref.current
    graph_container.innerHTML = props.graph_svg;

  }, [props.graph_svg])

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
