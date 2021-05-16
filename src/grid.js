import React from 'react';
import Button from '@material-ui/core/Button';
import { DataGrid, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState,ContentState,convertToRaw } from 'draft-js';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {stateFromHTML} from 'draft-js-import-html';
import Dialog from '@material-ui/core/Dialog';


export default class MyGrid extends React.Component  {
    constructor(props) {
        super(props);
    
        this.state = {
            row:props.rows,
            col:props.columns,
            disable: true,
            open: false,
            subject:'',
            editorState: EditorState.createEmpty()
        };
    }

    componentDidMount(props){
    }

    componentWillReceiveProps(props){
        this.setState({
            row: props.rows,
            col: props.columns
        });
        if(props.rows.length>0){
            this.setState({
                disable:false
            })
        }
    }

    sendData(){
        //console.log('send')
        var pop = document.getElementsByClassName("popup");
        pop.click();

    }

    handleOpen() {
        this.createPreview()
        this.setState({
          open:true
        })
    };

    createPreview(){
        var subject = localStorage.getItem('subject')
        var template = localStorage.getItem('template')
        var data = this.props.rows[0];
        var content = template.replace('[ First Name ]',data.Talent_Name.split(" ")[0]);
        for(var i = 0; i < 5; i++){
            content = content.replace('[Job Name]',data['Job'+(i+1)+' Name'])
            content = content.replace('[Company]',data['Job'+(i+1)+' Company'])
            content = content.replace('[Location]',data['Job'+(i+1)+' Location'])
            content = content.replace('[URL:….]',data['Job'+(i+1)+' URL'])
        }
        this.setState({
            editorState : EditorState.createWithContent(stateFromHTML(content)),
            subject : subject
        })
    }

    handleClose(){
        this.setState({
          open:false
        })
    };

    render() {
        return (
            <div style={{ height: 500, width: '100%'}}>
                <DataGrid rows={this.state.row} columns={this.state.col} />
                <Button variant="contained" color="primary" disabled={this.state.disable} onClick={this.handleOpen.bind(this)}>Send</Button>
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
        );
    }
}