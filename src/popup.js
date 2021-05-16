import React,{Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState} from 'draft-js';
import {stateFromHTML} from 'draft-js-import-html';


export default class Popup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            subject:'',
            editorState: EditorState.createEmpty()
          };
    }

    handleOpen() {
        this.createPreview()
        this.setState({
          open:true
        })
    };

    handleClose(){
        this.setState({
          open:false
        })
    };

    //replace template content and create preview
    createPreview(){
        var subject = localStorage.getItem('subject')
        var template = localStorage.getItem('template')
        var data = this.props.props;
        var content = template.replace('[ First Name ]',data.Talent_Name.split(" ")[0]);
        //console.log(content)
        for(var i = 0; i < 5; i++){
            content = content.replace('[Job Name]',data['Job'+(i+1)+' Name'])
            content = content.replace('[Company]',data['Job'+(i+1)+' Company'])
            content = content.replace('[Location]',data['Job'+(i+1)+' Location'])
            content = content.replace('[URL:….]',data['Job'+(i+1)+' URL'])
        }
        //console.log(content)
        this.setState({
            editorState : EditorState.createWithContent(stateFromHTML(content)),
            subject : subject
        })
    }


    render(){
        return(
            <div>
                <button className={'popup'} onClick={this.handleOpen.bind(this)}>PRVW(PopUp)</button>
                <Dialog open={this.state.open} onClose={this.handleClose.bind(this)} aria-labelledby="form-dialog-title">
                <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                    Email Subject: {this.state.subject}
                </DialogTitle>
                <DialogContent>
                    <Editor 
                        editorState={this.state.editorState}
                        toolbarHidden={true}
                    ></Editor>
                </DialogContent>
                </Dialog>
            </div>       
        )
    }


}