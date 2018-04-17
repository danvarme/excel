import React from 'react';
import { Button, Modal, FieldGroup, Form } from 'react-bootstrap';

const UploadModal = (props) => {

   if (!props.modalIsOpen) {
      return <div></div>;
   }
   return (

        <div className="static-modal">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>Subir archivo excel</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <form id="center" className="uploader" encType="multipart/form-data" >
                  <div className="form-group">
                      <input type="file" name="file" className="upload-file"/>
                      <input type="hidden" value="{{ csrf_token() }}" name="_token"/>
                  </div>
              </form> 
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={() => props.onRequestClose()}>Close</Button>
              <Button bsStyle="primary" onClick={() => props.uploadFile()}>Procesar excel</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
   );
};

export default UploadModal;