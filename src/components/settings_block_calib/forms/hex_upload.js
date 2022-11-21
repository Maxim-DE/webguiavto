import React from 'react'
import Dropzone from 'dropzone'
import { PulseLoader } from 'react-spinners';
import { ToastContainer, toast, Zoom } from 'react-toastify';

import FormInput from '../../form_input';
import ModalCalib from '../../calib_modal';

function Hex_upload(props) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState({
    progress: 0
  });
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
        setIsUploadModalOpen(true)
      })

      hex_dropzone.on('uploadprogress', (file, progress, bytesSent) => {
        console.log(progress);
        
        setUploadProgress({
          progress: progress,
        })
      })

      hex_dropzone.on('success', file => {
        setIsUploading(false)
        setIsUploadModalOpen(false)
        toast.success(`Успешно загружено`, { autoClose: 1500 })
      })

      hex_dropzone.on('error', (file, message) => {
        setIsUploading(false)
        setIsUploadModalOpen(false)
        toast.error(`Ошибка загрузки`, { autoClose: 1500 })
      })
    }
  }, [hex_dropzone_ref.current])

  React.useEffect(() => {
    console.log(isUploading);
    let request_obj

    if (isUploading) {
      request_obj = {
        action: 'block_queue'
      }
    } else {
      request_obj = {
        action: 'unblock_queue'
      }
    }
    

    props.updateHandler(request_obj)
  }, [isUploading])

  const handleModalClose = () => {
    setIsUploadModalOpen(false)
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
    {isUploadModalOpen &&
      <ModalCalib
        header='загрузка hex-прошивки'
        setIsOpen={handleModalClose}
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
        </div>
        
      </ModalCalib>}
    </>
  )
}

export default Hex_upload