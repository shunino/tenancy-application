import React, { useReducer, useCallback, useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button } from 'react-bootstrap';
import web3 from "web3";
import './mainHome.css';
import Table from 'react-bootstrap/Table';

function RequestList({ userInfo }) {
  const { state: { contract, accounts } } = useEth();
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    const init = async () => {
      const requestArr = await contract.methods.getAllRequest().call();
      setRequestList(requestArr)
      console.log('requestArr',requestArr)
    };

    if(contract){
      init();
    }

  }, [contract]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp*1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleRequest = async (re) => {
    const curTime = Date.now();
    await contract.methods.modifyRequest(re.requestId, curTime).send({ from: accounts[0],gas:300000 });
    alert('solving the request successfully!')
    window.location.reload()
  };

  return (
    <div className="common-box">
      <h1>Request List</h1>
        <div className="content">
          <div className="right-panel">
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>RoomInfo</th>
                  <th>requestType</th>
                  <th>description</th>
                  <th>createTime</th>
                  <th>state</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody>
                {requestList.map(request => (
                   <tr>
                    <td>{request.roomInfo}</td>
                    <td>{request.requestType}</td>
                    <td>{request.description}</td>
                    <td>{formatDate(request.createTime)}</td>
                    <td>{request.isResolved ? 'solved' : 'waiting solving'}</td>
                    <td>{request.isResolved ? ('solved time: '+formatDate(request.endTime)) : (<button onClick={() => handleRequest(request)} >handling the request</button>) }</td>
                  </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
    </div>
  );
}

export default RequestList;
