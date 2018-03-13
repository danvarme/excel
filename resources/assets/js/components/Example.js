import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Example extends Component {

    uploadFile(e){
        var fd = new FormData();    
        fd.append('file', $('input[type=file]')[0].files[0]);

        $.ajaxSetup({
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
        });

        console.log(fd);

        $.ajax({
            url: '/getInfo',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data){
                console.log(data);
            } 
        });
        e.preventDefault()
    }

    render() {
        return (
            <div>                
               <form ref="uploadForm" className="uploader" encType="multipart/form-data" >
                   <input ref="file" type="file" name="file" className="upload-file"/>
                   <input type="hidden" value="{{ csrf_token() }}" name="_token"/>
                   <input type="button" ref="button" value="Upload" onClick={this.uploadFile.bind(this)} />
               </form>                
            </div>
        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
