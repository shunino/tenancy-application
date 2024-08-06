import React, { useReducer, useCallback, useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button } from 'react-bootstrap';
import web3 from "web3";
import './mainHome.css';

function SearchInfo({ userInfo }) {
  const { state: { contract, accounts } } = useEth();
  const [address, setAddress] = React.useState('');
  const [rentInfo, setRentInfo] = React.useState({});
  useEffect(() => {
    const init = async () => {
      
    };

    if(contract){
      init();
    }

  }, [contract]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAddress(value);
  };

  const searchByAd = async () => {
    console.log('address',address)
    const rentInfos = await contract.methods.getTenantRentInfoByAd(address).call({ from: accounts[0]});
    console.log('rentInfo',rentInfos)
    setRentInfo(rentInfos)
  };

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
            <div className="card">
              <h2>Searching the tenancy information using address </h2>
              <div className="c-info">
                <input
                  type="text"
                  name="name"
                  value={address}
                  onChange={handleInputChange}
                  style={{    'width': '100%',
    'padding': '10px'}}
                />
              </div>
              <div className="he1"><button onClick={() => searchByAd()}>Search</button></div>
              <div>
                {rentInfo.createTime ? 
                  <div className="card">
                  <h2>The Result</h2>
                  <div className="he1">RoomInfo:<div className="he2">{rentInfo.description}</div></div>
                  <div className="he1">Price:<div className="he2">£125.00 per week</div></div>
                  <div className="he1">Check In Date:<div className="he2">{formatDate(rentInfo.createTime)}</div></div>
                  <div className="he1">Check Out Date:<div className="he2">{formatDate(rentInfo.endTime)}</div></div>
                  <div className="he1">total prices:<div className="he2">£{rentInfo.payTotal}</div></div>
                  {rentInfo.nextTime<rentInfo.endTime ? <div>the latest date of payment: <div className="emphasize">{formatDate(rentInfo.nextTime)}</div></div> : <div style={{'fontSize':'28px','color':'red'}}>have paid all rent!</div>}
                </div>
                :
                null

                }
                
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default SearchInfo;
