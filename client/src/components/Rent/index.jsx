import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Cta from "./Cta";
import Contract from "./Contract";
import ContractBtns from "./ContractBtns";
import Desc from "./Desc";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Demo() {
  const { state } = useEth();
  const [value, setValue] = useState("?");
  const { state: { contract, accounts } } = useEth();
  const connect = async () => {
    alert('fdfd')
    console.log(contract,accounts)
  };
  return (
    <div className="demo">
      <div onClick={connect}>链接mate</div>
    </div>
  );
}

export default Demo;
