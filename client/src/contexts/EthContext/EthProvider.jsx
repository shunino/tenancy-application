import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import styles from '../../RentCss/EthProvider.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Home from "../../RentComponents/Home";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isVisible, setIsVisible] = React.useState(false);
  const init = useCallback(
    async artifact => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:7545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        let address, contract;
        try {
          address = artifact.networks[networkID].address;
          contract = new web3.eth.Contract(abi, address);
          setIsVisible(true);
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract }
        });
      }
    }, []);
  const tryInit = async () => {
      try {
        const artifact = require("../../contracts/TenancyContract.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
  };
  const connectMeta = async () => {
      tryInit()
  };
  
  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setIsVisible(true);
        tryInit()
      } else {
        setIsVisible(false);
      }
    };
    checkMetaMaskConnection();
    
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = (a,b) => {
      if(a.length==0){
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      <Home connectMeta={connectMeta} isVisible={isVisible} ></Home>
    </EthContext.Provider>
  );
}

export default EthProvider;
