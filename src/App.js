import logo from './logo.svg';
import './App.css';
import Email from './email';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import XLSX from 'xlsx';
import React from 'react';
import MyGrid from './grid';
import Popup from './popup'
 

class App extends React.Component {


  col = []
  row = []


  constructor(props) {
    super(props);
    this.state = {
        columes:this.col,
        rows:this.row
    };
  } 

  talents=null;
  jd=null;


  handleTalentsExcelFileChange = (file) => {
    const files = file.target.files;
    if(files && files[0]) {
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = (e) => {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws);
          this.talents = data;
      };
      if(rABS) reader.readAsBinaryString(files[0]); else reader.readAsArrayBuffer(files[0]);
    }
  }


  handleJdExcelFileChange = (file) => {
    const files = file.target.files;
    if(files && files[0]) {
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = (e) => {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          this.jd=data;
      };
      if(rABS) reader.readAsBinaryString(files[0]); else reader.readAsArrayBuffer(files[0]);
    }
  }

      loadData = () =>{
        if(this.talents==null){
          alert('Please upload talents file.')
        } else if(this.jd==null){
          alert('Please upload job description file.')
        } else {

          this.col=[
            {field:'Talent_Name',headerName:'Talent_Name',width:200},
            {field:'Email',headerName:'Email',width:300},
            {field:'Location',headerName:'Location',width:250},
            {field:'Seniority',headerName:'Seniority',width:150,renderCell:(params => {
              return(params.value.split("_")[1])
            })},
            {field:'TechStack',headerName:'TechStack',width:250},
            {field:'IOM',headerName:'IOM',width:150},
            {field:'Job1 URL',headerName:'Job1',width:100,renderCell:(params => {
              return(<a href={params.value}>J1URL</a>)
            })},
            {field:'Job2 URL',headerName:'Job2',width:100,renderCell:(params => {
              return(<a href={params.value}>J2URL</a>)
            })},
            {field:'Job3 URL',headerName:'Job3',width:100,renderCell:(params => {
              return(<a href={params.value}>J3URL</a>)
            })},
            {field:'Job4 URL',headerName:'Job4',width:100,renderCell:(params => {
              return(<a href={params.value}>J4URL</a>)
            })},
            {field:'Job5 URL',headerName:'Job5',width:100,renderCell:(params => {
              return(<a href={params.value}>J5URL</a>)
            })},
            {field:'LinkedInURL',headerName:'LinkedInURL',width:500,renderCell:(params => {
              return(<a href={params.value}>{params.value}</a>)
            })},
            {field:'Preview',headerName:'Preview',width:150,renderCell:(params => {
              return(
                <Popup props={this.talents[params.id]}/>
              )
            })}
          ]

          this.row = this.mergeData(this.talents,this.jd);

          this.setState({
            rows:this.row,
            columes:this.col
          })
        }
        
      }

  calulateSimilarity(talent,jd){
    var score = 0;
    if(talent['Location'] == jd['Location']) score = score+10;
    if(talent['Seniority'] == jd['Seniority']) score = score+10;
    if(talent['TechStack'] == jd['TechStack']) score = score+10;
    if(talent['IOM'] == jd['IOM']) score = score+10;
    return score;
  }
  
  sortJob(a,b){
    return b[0]-a[0];
  }

  mergeData(talents,jd){
    for(var i = 0; i < talents.length; i++){
      talents[i]["id"]=i;
      var list = [];
      for(var j = 0; j < jd.length; j++){
        var score = this.calulateSimilarity(talents[i],jd[j]);
        list.push([score,j]);
      }
      list.sort(this.sortJob)
      for(var k = 1; k < Math.min(6,list.length); k++){
        var job = jd[list[k-1][1]];
        talents[i]["Job"+k+" Name"] = job['Job Name'];
        talents[i]["Job"+k+" Company"] = job['Company'];
        talents[i]["Job"+k+" Location"] = job['Location'];
        talents[i]["Job"+k+" URL"] = job['JobURL'];
      }
    }
    return talents;
  }

  render(){
    return (
      <div className="App">
        <h1>OCInsights Automated Newsletter System</h1>
        <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
        <Grid item xs={4}>
        <Button variant="contained" color="primary" onClick={()=>{document.getElementById('talentsimport').click()}}>Talents Import</Button>
        <input className={"noDisplay"} accept=".xlsx,.xls" id="talentsimport" type="file" onChange={this.handleTalentsExcelFileChange}/>
        <Button className={"loadButton"} variant="outlined" color="primary" onClick={this.loadData}>Load Data</Button>
      </Grid>

      <Grid item xs={4}>
        <Button variant="contained" color="primary" onClick={()=>{document.getElementById('jdimport').click()}}>JD Import</Button>
        <input className={"noDisplay"} accept=".xlsx,.xls" id="jdimport" type="file" onChange={this.handleJdExcelFileChange}/>
      </Grid>

      <Grid item xs={4}>
        <Email />
      </Grid>
          </Grid>
        </Grid>
        
        <div className="mygrid">
          <MyGrid rows={this.state.rows}  columns={this.state.columes}/>
        </div>
        
        
      </div>
    );
  }
  
}

export default App;
