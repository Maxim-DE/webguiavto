import React from 'react'
import Dropzone from 'dropzone'
import { PulseLoader } from 'react-spinners';
import { ToastContainer, toast, Zoom } from 'react-toastify';

import FormInput from '../../form_input';
import ModalCalib from '../../calib_modal';
import { reducers } from '../../../store/reducers/calib_forms_reducers';

function Hex_upload(props) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState({
    progress: 0
  });

  const hex_dropzone_ref = React.useRef(null)
  const hex_dropzone_instance = React.useRef(null)

  
  React.useEffect(() => {
    if (!hex_dropzone_instance.current) {
      hex_dropzone_instance.current = new Dropzone(hex_dropzone_ref.current, {
        url: '/write_dump_memory',
        chunking: true,
        chunkSize: 1024,
        parallelUploads: 1,
        forceChunking: true,
        retryChunks: true,
        retryChunksLimit: 2
      });
  
      hex_dropzone_instance.current.on('addedfile', file => {
        setIsUploading(true)
      })
  
      hex_dropzone_instance.current.on('uploadprogress', (file, progress, bytesSent) => {
        let progress_rounded = progress.toFixed()
        
        setUploadProgress({
          progress: progress_rounded,
        })
      })
  
      hex_dropzone_instance.current.on('success', (file, message) => {
        setIsUploading(false)
        setUploadProgress({
          progress: 0,
        })

        if (Object.keys(message).length > 0 &&
          Object.prototype.hasOwnProperty.call(message, 'Notific')) {
          toast.success(`${message.Notific.text}`, { autoClose: 1500 })
        } else {
          toast.success(`Успешно загружено`, { autoClose: 1500 })
        }

        const request_obj = {
          address: 'calib_get_info_firmware.cgi',
          reducer: reducers.calibration_form,
          notifications: {
            good: 'default',
            bad: 'default'
          }
        }

        props.updateHandler(request_obj)
      })
  
      hex_dropzone_instance.current.on('error', (file, message) => {
        const xhr_response_obj = file.xhr
        console.log(xhr_response_obj);
        setIsUploading(false)
        setUploadProgress({
          progress: 0,
        })

        if (Object.keys(message).length > 0 &&
          Object.prototype.hasOwnProperty.call(message, 'Notific')) {
          toast.error(`${message.Notific.text}`, { autoClose: 1500 })
        } else {
          toast.error(`Ошибка загрузки`, { autoClose: 1500 })
        }

        const request_obj = {
          address: 'calib_get_info_firmware.cgi',
          notifications: {
            good: 'default',
            bad: 'default'
          }
        }

        props.updateHandler(request_obj)
      })
  
      console.warn('dropzone created successfully');
    }
  }, [])

  React.useEffect(() => {
    let request_obj

    if (isUploading) {
      setIsUploadModalOpen(true)
      request_obj = {
        action: 'block_queue'
      }

    } else {
      setIsUploadModalOpen(false)
      request_obj = {
        action: 'unblock_queue'
      }
    }
    
    props.updateHandler(request_obj)
  }, [isUploading])



  const handleModalClose = () => {
    setIsUploading(false)
    
    if (hex_dropzone_ref.current.dropzone) {
      hex_dropzone_instance.current.removeAllFiles(true)
    }
  }

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
        <input
          id="hex_upload_zone"
          name='file'
          ref={hex_dropzone_ref}
          className={`button_input disabled_input`}
          type="button"
          value='Открыть файл' />
      </div>
    </li>
    {/* <li
      key='test_block_calib'
      className="settings_item">
      <div className='item_header'>
        <label
          className="settings_itemLabel">
          Queue block
        </label>
      </div>
      <div className='item_input'>
        <input
          className={`button_input`}
          type="button"
          onClick={(e) => {
            const request_obj = {
              action: 'block_queue'
            }

            props.updateHandler(request_obj)

            
          }}
          value='block' />
      </div>
    </li> */}
    {isUploadModalOpen &&
      <ModalCalib
        header='загрузка hex-прошивки'
        setIsOpen={handleModalClose}
        user_controllable={true}
        class='full_log_modal hex_upload_modal'>
        <div className='hex_upload_message_wrap'>
          <PulseLoader
            color="#bbcacf"
            loading
            margin={9}
            size={13}
            speedMultiplier={0.5}
          />
          <div className='hex_upload_upload_progressage'>
            {uploadProgress.progress}%
          </div>
          <span className='hex_upload_upload_message'>
            Идет загрузка прошивки... Пожалуйста, не перезагружайте страницу во время процесса.
          </span>
          <FormInput
            id={`cancel_hex_upload_input`}
            name={`cancel_hex_upload`}
            clickHandler={handleModalClose}
            label='Отменить загрузку'
            type="button" />
        </div>
        
      </ModalCalib>}
    </>
  )
}

export default Hex_upload