import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button";
import { Check, ChevronDown, ChevronUp, UserRoundCheck, UserRoundPlus, WalletMinimal } from "lucide-react";
import { Card } from "./ui/card";
import abi from '../utils/abi'
import Web3 from "web3";

const Landing = () => {

    const [amount, setAmount] = useState(0.05);
    const [name, setName] = useState("");
    const [connected, setConnected] = useState(false);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [participated, setParticipated] = useState(false);

    const address = "0x795Fbddad0C4c95Eb36828dde26c1BF1EdA8544a";

    const changeAmount = (mode) => {
        if (mode == "inc")
            setAmount(prev => prev + 0.01)
        else
            setAmount(prev => prev - 0.01)
    }

    useEffect(() => {
        const checkProvider = async () => {
          if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);

            try {
              const existingAccounts = await web3Instance.eth.getAccounts();
              if (existingAccounts.length > 0) {
                setAccounts(existingAccounts);
                const contractInstance = new web3Instance.eth.Contract(abi, address);
                setContract(contractInstance);
                setConnected(true);
              }
            } catch (error) {
              console.error("Error checking existing accounts:", error);
            }
          } else {
            console.error("No Ethereum provider found");
          }
        };

        checkProvider()
    }, [])

    const connectWallet = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const userAccounts = await web3Instance.eth.getAccounts();
          setAccounts(userAccounts);

          const contractInstance = new web3Instance.eth.Contract(abi, address);
          setContract(contractInstance);

          setConnected(true);
        } else {
          console.error("No Ethereum provider found");
        }
    } catch (error) {
        console.error("Error connecting to Ethereum:", error);
    }
  };

    const participate = async () => {
      if (!connected) {
        console.error("Wallet not connected");
        return;
      }
  
      if (!contract) {
        console.error("Contract not initialized");
        return;
      }
  
      try {
        await contract.methods.participate(name).send({
          from: accounts[0],
          value: Web3.utils.toWei(amount.toString(), "ether")
        });
        console.log("Participation successful");
        setParticipated(true)
      } catch (error) {
        console.error("Error participating in the lottery:", error);
      }
    };

    const participantExists = async () => {
      try {
        if (!connected) {
          console.error("Wallet not connected");
          return;
        }
    
        if (!contract) {
          console.error("Contract not initialized");
          return;
        }
        
        const exists = await contract.methods.participantExists(accounts[0]).call()
        setParticipated(exists)
      } catch (error) {
        console.log(error);
      }
    }
  
    useEffect(() => {
      participantExists()
    }, [connected, contract])
  return (
    <>
        <section className="flex flex-col md:flex-row items-center h-screen mx-10 py-40 md:py-0 gap-8 md:gap-0">
            <div className="h-full flex md:w-1/2 items-center dark:text-[#dfdfdf]">
                <h1 className="font-bold">Participate in the biggest lucky draw of Ethereum blockchain!</h1>
            </div>

            <Card className="p-5 md:w-1/2 flex flex-col gap-2">
              {!participated &&
                <>
                  {!connected && <Button variant="outline" className="w-fit" onClick={connectWallet}>Connect Wallet <WalletMinimal size={24} className="mx-2" /></Button>}
                  {connected && <Button variant="outline" className="w-fit">Connected Wallet: {accounts[0]} <Check size={24} className="mx-2" /></Button>}
                  <div>
                      <Label>Enter amount:</Label>
                      <div className="flex flex-row gap-1 mt-1">
                          <Input readOnly defaultValue={amount.toString()} value={amount.toString()} />
                          <Button variant="outline" onClick={() => changeAmount("inc")}><ChevronUp size={24} /></Button>
                          <Button variant="outline" disabled={amount == 0.05} onClick={() => changeAmount("dec")}><ChevronDown size={24} /></Button>
                      </div>
                      <Label className="dark:text-neutral-300 text-neutral-800">Please deposit a minimum of 0.05 ETH</Label>
                  </div>

                  <div>
                      <Label>Your name:</Label>
                      <Input onChange={e => setName(e.target.value)} className="mt-1" />
                  </div>
                  <Button className="mt-4" onClick={participate}>Partcipate <UserRoundPlus size={24} className="mx-2" /></Button>
                </>
              }

              {participated &&
                <Button variant="outline">Participated <UserRoundCheck size={24} className="mx-2" /></Button>
              }
            </Card>
        </section>
    </>
  )
}

export default Landing