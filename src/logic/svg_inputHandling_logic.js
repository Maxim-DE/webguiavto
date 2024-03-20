import { makeSVG } from "./utilites";

export class SVG_inputElement {
  constructor() {}

  createForeignForInput(x, y, width = 1, height = 1) {
    const for_obj = makeSVG("foreignObject", { x: x, y: y, width: width, height: height })

    for_obj.classList.add('svg_input');

    return for_obj
  }

  createSaveButton() {
    let button_instance = document.createElement("button")

    button_instance.type = "button"
    button_instance.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="margin: 2px 0px 0px;"><path fill="none" d="M0 0h24v24H0z"></path><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg>'
    button_instance.setAttribute("title", "Сохранить")
    button_instance.classList.add('save_input_btn')

    return button_instance
  }

  createInputElement(x = 0, y = 0, type, attrs = {}, styles = {}, className = "", label, saveHandler = function() {}) {
    let input_instance = document.createElement("input"),
        submit_button = this.createSaveButton(),
        input_wrap = document.createElement('div')

    input_instance.type = type

    if (className.length > 0) {
      const class_arr = className.split(' ')
      class_arr.forEach(class_name => {
        input_instance.classList.add(class_name)
      });
    }

    for (let k in attrs) {
      input_instance.setAttribute(k, attrs[k]);
    }

    for (let l in styles) {
      input_instance.style[l] = styles[l]
    }

    input_instance.style.marginLeft = "4px"

    input_instance.dataset.isOpen = false
    input_instance.classList.add('invisible')

    submit_button.classList.add('invisible')
    submit_button.disabled = true

    input_instance.dataset.statusData = "0"
    input_instance.dataset.valLabel = label
    
    input_instance.addEventListener("keyup", event => {
      this.submitHandler(event, input_instance, saveHandler)
      
      if (event.key === 'Enter') {
        this.visibilityHandler(input_instance, submit_button, false)
      }
    })

    
    input_wrap.classList.add('svg_input_wrap')

    input_wrap.addEventListener("click", event => {
      let target = event.target

      if (target.tagName == "INPUT") {
        this.visibilityHandler(input_instance, submit_button, true)
      } else if (target.closest('button')) {
        this.visibilityHandler(input_instance, submit_button, false)
      }
    })

    input_wrap.addEventListener("focusout", event => {
      let related_target = event.relatedTarget

      if (!related_target) {
        this.visibilityHandler(input_instance, submit_button, false)
      }
    }, true)

    submit_button.addEventListener("click", event => {
      this.submitHandler(event, input_instance, saveHandler)
    })

    const input_aligh = input_instance.style?.textAlign ? input_instance.style.textAlign : "left"

    if (input_aligh == "right") {
      input_wrap.append(submit_button)
      input_wrap.append(input_instance)
    } else {
      input_wrap.append(input_instance)
      input_wrap.append(submit_button)
    }

    let for_obj = this.createForeignForInput(x - 21, y)
    for_obj.append(input_wrap)

    return for_obj
  }

  visibilityHandler(input, save_button, focus = false) {
    const visibility = input.dataset?.isOpen ? input.dataset.isOpen : 0,
          status_data = input.dataset?.statusData

    if (focus) {
      input.classList.remove("invisible")
      input.value = status_data ? status_data : ''

      save_button.classList.remove("invisible")
      save_button.disabled = !focus
    } else {
      input.classList.add("invisible")
      input.value = ''

      save_button.classList.add("invisible")
      save_button.disabled = !focus
    }

    input.dataset.isOpen = focus
  }

  submitHandler(e, input, handler = function() {}) {
    const input_value = input.value

    if (e.type == "keyup") {
      if (e.key === 'Enter') {
        handler(input_value)
      }
    } else if (e.type == "click") {
      handler(input_value)
    }
  }
  
}