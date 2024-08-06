import React, { useReducer, useCallback, useEffect } from "react";
import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";
import styles from './common.module.css';
import { Button } from 'react-bootstrap';

import Login from './components/login';
import Modal from 'react-bootstrap/Modal';

import ContractBox from './components/contractBox';

function Home({ isVisible, connectMeta }) {
  const { state: { contract, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className={styles.home}>
       <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>TENANCY AGREEMENT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ContractBox></ContractBox>
        </Modal.Body>
      </Modal>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/RentImg/logo.png" alt="RentImg" />
        </div>
        <nav>
          <ul className={styles.nav}>
            {/*<li><a href="#">Cities</a></li>*/}
           {/* <li><a href="#">Help</a></li>
            <li><a href="#">Booking</a></li>*/}
            {/*<li><a href="#">Sign In</a></li>*/}
            <li onClick={handleShow}><a href="#">My Agreement</a></li>
          </ul>
        </nav>
      </header>
      <main className={styles.main}>
        { !isVisible ? <div className={styles.buttonBg}>
            <Button size="lg" className={styles.loginButton} variant="primary" onClick={connectMeta}>Connecting the MetaMask</Button> 
          </div>
         : <Login></Login>
      }
      </main>
      <footer className={styles.footer}>
        <ul className={styles.footerNav}>
          <li><a href="#">Contact us</a></li>
        </ul>
      </footer>
    </div>
  );
}

export default Home;
