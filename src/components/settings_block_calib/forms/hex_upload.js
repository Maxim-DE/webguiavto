import React from 'react'
import Dropzone from 'dropzone'
import { PulseLoader } from 'react-spinners';
import { ToastContainer, toast, Zoom } from 'react-toastify';

import FormInput from '../../form_input';
import ModalCalib from '../../calib_modal';

function Hex_upload(props) {
  const [isUploading, setIsUploading] = React.useState(false);
  const hex_dropzone_ref = React.useRef(null)

  React.useEffect(() => {
    console.dir(hex_dropzone_ref.current);
    if (hex_dropzone_ref.current != null &&
        !hex_dropzone_ref.current.dropzone) {
      let hex_dropzone = new Dropzone(hex_dropzone_ref.current, {
        url: '/write_dump_memory',
        chunking: true,
        chunkSize: 1.5 * 1024,
        parallelUploads: 1,
        forceChunking: true,
        retryChunks: true,
        retryChunksLimit: 2
      });

      hex_dropzone.on('addedfile', file => {
        setIsUploading(true)
      })

      hex_dropzone.on('success', file => {
        setIsUploading(false)
        toast.success(`Успешно загружено`, { autoClose: 1500 })
      })

      hex_dropzone.on('error', (file, message) => {
        setIsUploading(false)
        toast.error(`Ошибка загрузки`, { autoClose: 1500 })
      })
    }
  }, [hex_dropzone_ref.current])

  // const handleClick_open = () => {
  //   setIsOpen(true)
  // }

  // const handleModalClose = () => {
  //   setIsOpen(false)
  // }

  return (
    <>
    <li
      key='hex_upload_calib'
      id='hex_upload_calib'
      className="settings_item">
      <div className='item_header'>
        <label
          htmlFor={`hex_upload_calib_input`}
          className="settings_itemLabel">
          Загрузить прошивку
        </label>
      </div>
      <div className='item_input'>
        {/* <FormInput
          id={`hex_upload_calib_input`}
          name={`hex_upload_calib`}
          clickHandler={handleClick_open}
          label='Загрузить'
          type="button" /> */}
        {/* <div
          id="hex_upload_zone"
          className='button_input'
          ref={hex_dropzone_ref}
          name='file'>
            Открыть файл
        </div> */}
        {/* <button
          id="hex_upload_zone"
          name='file'
          className='button_input'
          ref={hex_dropzone_ref}
          type='button'>
          Открыть файл
        </button> */}
        {isUploading ? 
          <PulseLoader
            color="#bbcacf"
            loading
            margin={6}
            size={9}
            speedMultiplier={0.5}
          /> :
          <input
            id="hex_upload_zone"
            name='file'
            ref={hex_dropzone_ref}
            className={`button_input`}
            type="button"
            value='Открыть файл' />
        }
      </div>
    </li>
    {/* {isOpen &&
      <ModalCalib
        header='загрузка hex-прошивки'
        setIsOpen={handleModalClose}
        class='full_log_modal hex_upload_modal'>
        <div 
          id="hex_upload_zone"
          className='hex_upload_zone dropzone'
          ref={hex_dropzone_ref} 
          type="file" 
          name="file" />
        <input 
          type="file" 
          name="file" 
          id="hex_upload_zone"
          ref={hex_dropzone_ref} />
        <FormInput
          id={`hex_upload_zone`}
          name={`file`}
          clickHandler={handleClick_open}
          ref={hex_dropzone_ref}
          label='Загрузить'
          type="button" />
        
      </ModalCalib>} */}
    </>
  )
}

export default Hex_upload