import React from 'react'
import Dropzone from 'dropzone';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify/dist/components';
import ModalCalib from '../calib_modal';
import FormInput from '.';

export default function File_upload_input({
    id,
    disabled,
    style,
    label,
    updateHandler,
    upload_url,
    modal_header,
    modal_content
}) {

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
          url: upload_url,
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
  
        //   const request_obj = {
        //     address: 'calib_get_info_firmware.cgi',
        //     reducer: reducers.calibration_form,
        //     notifications: {
        //       good: 'default',
        //       bad: 'default'
        //     }
        //   }
  
        //   updateHandler(request_obj)
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
  
        //   const request_obj = {
        //     address: 'calib_get_info_firmware.cgi',
        //     notifications: {
        //       good: 'default',
        //       bad: 'default'
        //     }
        //   }
  
        //   updateHandler(request_obj)
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
      
      updateHandler(request_obj)
    }, [isUploading])
  
  
  
    const handleModalClose = () => {
      setIsUploading(false)
      
      if (hex_dropzone_ref.current.dropzone) {
        hex_dropzone_instance.current.removeAllFiles(true)
      }
    }

  return (
    <>
    <input
        id={id}
        name={`file_upload-${id}`}
        ref={hex_dropzone_ref}
        className={`button_input`}
        disabled={disabled}
        style={style}
        type="button"
        value={label} />
    {
        isUploadModalOpen &&
        <ModalCalib
            header={modal_header}
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
                    {modal_content}
                </span>
                <FormInput
                    id={`cancel_hex_upload_input`}
                    name={`cancel_hex_upload`}
                    clickHandler={handleModalClose}
                    label='Отменить загрузку'
                    type="button" />
            </div>

        </ModalCalib>
    }
    </>
  )
}
