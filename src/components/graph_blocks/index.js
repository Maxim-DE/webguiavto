import React from 'react';
import ReactDOM from 'react-dom';

import { ReactComponent as Graph_digital } from '../../imgs/digital_exiter.svg'
import './index.css'


const status_colors = [
  '#202020', //good
  '#f9c22e', //warning
  '#fe5f55', //error
  '#658E9C', //hibernation
]


function Status_graphs(props) {
  // const [graph_data, setGraphData] = React.useState({
  //   data: {},
  // })

  const graph_ref = React.useRef(null)

  React.useEffect(() => {
    let graph_svg = graph_ref.current
    let graph_data = props.data

    for (const key in graph_data) {
      let graph_block = graph_svg.querySelector(`#${key}`)
      let graph_block_data = graph_data[key]

      for (const item in graph_block_data) {
        
        if (item == "status") {
          let device_icon = graph_block.querySelector(`#${key}_device_icon`)

          device_icon.attributes.fill.value = status_colors[graph_block_data[item]]
          
          continue
        }
        
        let graph_block_value_span_id = `#${key}_${item}_value`
        let graph_block_value_span = graph_block.querySelector(graph_block_value_span_id).children[0]
        
        let new_value

        if (Array.isArray(graph_block_data[item])) {
          let input_value = graph_block_data[item][0],
              divider = graph_block_data[item][1],
              status = graph_block_data[item][2],
              postfix = graph_block_data[item][3] ? 
                        ' ' + graph_block_data[item][3] :
                        ''                        ,

              fract = (input_value / divider) % 1,
              round_index

          if (fract < 0.1 &&
              fract > 0) {
            round_index = 2
          } else if (fract == 0) {
            round_index = 0
          } else {
            round_index = 1
          }

          new_value = (input_value / divider).toFixed(round_index)
          new_value = new_value + postfix

          if (status != 0) {
            graph_block_value_span.attributes["font-weight"].value = "500";
          }
          
          graph_block_value_span.style.fill = status_colors[status];

        } else {
          new_value = graph_block_data[item]
        }

        // if (item == "input_pwr" ||
        //     item == "output_pwr") {
        //   new_value = new_value + " Вт"
        // }

        console.log(graph_block_value_span);

        graph_block_value_span.innerHTML = new_value
      }
    }


    // let amplifier_amperage_value = graph_svg.querySelector('#amplifier_amperage1_value')
    // console.dir(graph_ref.current);
    // console.log(amplifier_amperage_value);
    // amplifier_amperage_value.children[0].innerHTML = '9999';
    
  }, [props.data])

  return (
    <div className="graphs">
      <Graph_digital ref={graph_ref} />
    </div>
  )
}

// function Graph_block(props) {
//   return (
//     <div className="graph_container">
//       <div className="graph_header">
//         <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <rect width="14" height="14" rx="2" fill="#7ADC47"/>
//         </svg>
//         <h4>{graph_blocks_map[0][props.type][0].block_header}</h4>
//       </div>
//       <div className="graph_pwr_display">
//           <div className="pwr_out_display">
//             <div className="pwr_indicator_in"></div>
//             <span>120 Вт</span>
//           </div>
//           <div className="pwr_out_display">
//             <span>120 Вт</span>
//             <div className="pwr_indicator_out"></div>
//           </div>
//       </div>
//       <ul className="graph_main_params">
//         {graph_blocks_map[0][props.type][0].param_list.map(item => {
//           return (
//             <li
//               key={item.id}
//               id={item.id}
//               className="graph_item">
//               <span>{item.label}</span>
//               <span>0</span>
//             </li>
//           )
//         })}
//       </ul>
//     </div>
//   )
// }

export default Status_graphs;
