import React, { useReducer, useCallback, useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import './contractBox.css';

const ContractBox = () => {
  const { state: { contract, accounts } } = useEth();
  
  const [hasRent, setHasRent] = React.useState(false);
  const [rentInfo, setRentInfo] = React.useState(null);
  const [aggreements, setAggreements] = React.useState(null);

  useEffect(() => {
    const init = async () => {
      //get aggreements
      const aggreements = await contract.methods.getAgreement().call();
      //console.log('myaggreements',aggreements)
      setAggreements(aggreements)
      //
      const curTime = Date.now();
      const rentInfos = await contract.methods.hasRentInfo(accounts[0],curTime).call();
      //console.log('rentInfo info',rentInfos)
      if(rentInfos.rentId!=0){
        setHasRent(true)
        setRentInfo(rentInfos)
      }
    };

    if(contract){
      init();
    }

  }, [contract]);

  const formatDate1 = (timestamp) => {
    const date = new Date(timestamp*1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const TermsComponent = () => {
    return (
      <div className="terms">
        <h2>{aggreements.title}</h2>
        <div>
          {aggreements.sections.map(term => (
            <div key={term.id}>
              <h1>{term.title}</h1>
              <div>
                {term.points.map(term1 => (
                  <p key={term1.id}>{term1}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    rentInfo ? (
      <div className="contract-box">
        <div className="stamp">HAVE SIGNED</div>
        <div className="he1">Address of the room:<div className="he2">{rentInfo.description}</div></div>
        <div className="he1">Price:<div className="he2">£125.00 per week</div></div>
        <div className="he1">Check In Date:<div className="he2">{formatDate1(rentInfo.createTime)}</div></div>
        <div className="he1">Check Out Date:<div className="he2">{formatDate1(rentInfo.endTime)}</div></div>
        <div className="he1">Total prices:<div className="he2">{rentInfo.payTotal}</div></div>
        {TermsComponent()}
      </div>
    ) : (
      <div>you have not rented any room.</div>
    )
  );
};

export default ContractBox;