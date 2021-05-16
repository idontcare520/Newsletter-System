import React,{Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState,convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {stateFromHTML} from 'draft-js-import-html';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class Email extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      subject: '',
      editorState: EditorState.createEmpty()
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);


  }

  componentDidMount(){
    if(localStorage.getItem('subject')!=null){
      this.setState({
        subject : localStorage.getItem('subject')
      })
    }
    var template = localStorage.getItem('template');
    if(template != null){
      this.setState({
        editorState: EditorState.createWithContent(stateFromHTML(template))
      })
    }
  }

  subjectChange(e){
    // console.log(e.target.value)
    this.setState({
			subject:e.target.value
		})
  }

  contentChange(editorState){
    //console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    this.setState({
      editorState: editorState
    });
  }

  handleOpen() {
    this.setState({
      open:true
    })
  };

  handleClose(){
    this.setState({
      open:false
    })
  };

  handleSave(){
      
      this.setState({
        open:false
      })
      localStorage.setItem("subject",this.state.subject)
      localStorage.setItem("template",draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())))
     
  }

  render(){
    return (
      <div style={{display:'inline-block'}}>
        <Button variant="contained" color="primary" onClick={this.handleOpen}>
          Email Template
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogContent>
            <TextField
              margin="dense"
              id="subject"
              name="subject"
              label="Subject"
              onChange={this.subjectChange.bind(this)}
              defaultValue={this.state.subject}
              fullWidth
            />
            <p>Hi, [NAME]:</p>
            <Editor
              editorState={this.state.editorState}
              onEditorStateChange={this.contentChange.bind(this)}/>
            {/* <textarea id="email-content" rows="4" cols="50">test</textarea> */}
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button> */}
            <Button onClick={this.handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
}
