import React, { Component } from 'react';
import Record from './Record';
import RecordForm from './RecordForm';
import AmountBox from "./AmountBox";
import * as RecordsAPI from '../utils/RecordsAPI'

class Records extends Component {
  constructor(){
    super();
    this.state = {
      error:null,
      isLoaded:false,
      records:[]
    }
  }

  addRecord(record){
    this.setState({
      error:null,
      isLoaded:true,
      records:[
        ...this.state.records,
        record
      ]
    })
  }

  deleteRecord(record){
    const recordIndex = this.state.records.indexOf(record);
    const newRecords = this.state.records.filter( (item, index) => index !== recordIndex);
    this.setState({
      records: newRecords
    });
  }
 
  updateRecord(record,data){
    const recordIndex = this.state.records.indexOf(record);
    const newRecords = this.state.records.map( (item, index) => {
      if(index !== recordIndex) {
        // This isn't the item we care about - keep it as-is
        return item;
      }

      // Otherwise, this is the one we want - return an updated value
      return {
        ...item,
        ...data
      };
    });
    this.setState({
      records: newRecords
    });
  }

  credits(){ // 收入
    let credits = this.state.records.filter((record)=>{
       return record.amount >=0;
      }
    )

    return credits.reduce((prev,curr) => {
      return prev + Number.parseInt(curr.amount,0);
    },0)
  }

  debits(){ // 支出
    let credits = this.state.records.filter((record)=>{
      return record.amount <0;
     }
   )

   return credits.reduce((prev,curr) => {
     return prev + Number.parseInt(curr.amount,0);
   },0)
  }

  balance(){ // 余额
    return this.credits() + this.debits();
  }

  componentDidMount(){
    RecordsAPI.getAll().then(
        reponse=>this.setState({
          records:reponse.data,
          isLoaded:true
        })
      ).catch(
        error=>this.setState({
          isLoaded: true,
          error
        })
      )
  }
  render() {
    const {error,isLoaded,records} = this.state;
    let recordsComponent = null;
    if(error){
      recordsComponent = <div>Error:{error.message}</div>
    }else if(!isLoaded){
      recordsComponent = <div>Loading...</div>
    }else {
      recordsComponent = (
        <table className="table table-bordered">
        <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {records.map((record,i) => (
            <Record
               key={record.id}
               record={record}
               handleEditRecord={this.updateRecord.bind(this)} 
               handleDeleteRecord={this.deleteRecord.bind(this)}
            />
          ))}
            </tbody>
        </table>
      )
    }
        return (
          <div>
          <h2>Records</h2>
          <div className="row mb-3">
          <AmountBox text="Credits" type="success" amount={this.credits()}/>
          <AmountBox text="Debit" type="danger" amount={this.debits()}/>
          <AmountBox text="Balance" type="info" amount={this.balance()}/>
          </div>
          <RecordForm  handleNewRecord = {this.addRecord.bind(this)}/>
          {recordsComponent}
          </div>
        );
    }
  
  }

export default Records;
