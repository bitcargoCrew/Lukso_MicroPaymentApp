import React, { useState } from "react";
import { ethers } from "ethers";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

interface SendTokenProps {
  onClose: () => void;
}

const SendToken: React.FC<SendTokenProps> = ({ onClose }) => {
  const [receiver, setReceiver] = useState(""); // State to hold the receiver's address
  const [amount, setAmount] = useState(""); // State to hold the amount to send

  const sendTransaction = async () => {
    try {
      const provider = new ethers.BrowserProvider((window as any).lukso);

      // Request access to the user's Ethereum accounts
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      console.log(amount)

      // Send transaction
      const tx = await signer.sendTransaction({
        from: account,
        to: receiver, // Use the receiver state
        value: ethers.parseEther(amount), // Convert the amount state to the appropriate value
      });

      console.log("Transaction hash:", tx.hash);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "fixed", top: "50%",left: "50%", transform: "translate(-50%, -50%)", zIndex: 1050 }}
    >
      <Modal.Dialog>
        <Modal.Header closeButton onClick={onClose}>
          <Modal.Title>Send LYX</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>Receiver address</InputGroup.Text>
            <Form.Control
              aria-label="Receiver Address"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <Form.Control
              aria-label="LYX amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <InputGroup.Text>LYX</InputGroup.Text>
          </InputGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={sendTransaction}>
            Send
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};

export default SendToken;
