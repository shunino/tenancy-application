import React, { useReducer, useCallback, useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button } from 'react-bootstrap';
import web3 from "web3";
import './mainHome.css';

function MainHome({ changeType,info,chufa,rentInfo,setRentInfo }) {
  const { state: { contract, accounts } } = useEth();
  
  const [hasRent, setHasRent] = React.useState(false);

  // const [rentInfo, setRentInfo] = React.useState({});

  useEffect(() => {
    const init = async () => {
      // //test
      // const rentInfoTest = await contract.methods.getallTe().call();
      // console.log('rent arr',rentInfoTest)
      //
      const curTime = Date.now();
      const rentInfos = await contract.methods.hasRentInfo(accounts[0],curTime).call();
      console.log('rentInfo info',rentInfos)
      if(rentInfos.rentId!=0){
        setHasRent(true)
        chufa()
        setRentInfo(rentInfos)
      }
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

  return (
    <div className="common-box">
      <h1>Dashboard</h1>
        <div className="content">
          <div className="right-panel">
          { hasRent ? 

            <div className="card">
              <h2>hello,{info.name}</h2>
              <h3>using your account address to check in offline</h3>
              <div className="he1">you have book the room:<div className="he2">{rentInfo.description}</div></div>
              <div className="he1">Price:<div className="he2">£125.00 per week</div></div>
              <div className="he1">Check In Date:<div className="he2">{formatDate(rentInfo.createTime)}</div></div>
              <div className="he1">Check Out Date:<div className="he2">{formatDate(rentInfo.endTime)}</div></div>
              <div className="he1">total prices:<div className="he2">£{rentInfo.payTotal}</div></div>
              {rentInfo.nextTime<rentInfo.endTime ? <div>the latest date of payment: <div className="emphasize">{formatDate(rentInfo.nextTime)}</div></div> : <div style={{'fontSize':'28px','color':'red'}}>you have paid all rent!</div>}
              { rentInfo.nextTime<rentInfo.endTime ? <button onClick={() => changeType(3)}>payment in advance</button> : null}
            </div>
            :
            <div className="card">
              <p>welcom !</p>
              <h2>hello,{info.name}</h2>
              <p>you have not booked any rooms</p>
              <p>here is the Aberdeen, Causeway View</p>
              <p>we have many rooms that you can choices</p>
              <p>begin to book your rooms</p>
              <button onClick={() => changeType(2)}>book your room</button>
            </div>

          }
          </div>
        </div>
    </div>
  );
}

export default MainHome;
