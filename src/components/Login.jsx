import React from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";

import epnftABI from '../contract/epnft.json';
import { useHistory } from 'react-router-dom';

export default function Login(props) {
	const history = useHistory();

	const contractAddressE = "0x9212B12e5F5bAb7a9bD291929bb5b7CEb00B141C";
	const contractAddressP = "0x032fC85D34a05610Ee44eddA3c370910C09F528e";

	const DoConnect = async () => {

		console.log('Connecting....');
		try {
			// Get network provider and web3 instance.
			const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
			// Request account access if needed
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			const netId = await web3.eth.net.getId();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();
			// Get an instance of the contract sop we can call our contract functions
			let contractAddress = contractAddressE;
			if(netId == 80001) contractAddress = contractAddressP;

			const instance = new web3.eth.Contract(
				epnftABI,
				contractAddress
			);
			props.callback({ web3, accounts, contract: instance, netId });
			history.push('/mint');

		} catch (error) {
			// Catch any errors for any of the above operations.
			console.error("Could not connect to wallet.", error);
		}
	};

	const Disconnect = async () => {
		console.log("Disconnect Wallet!");
		//await Web3Modal.clearCachedProvider();
		//await web3.eth.currentProvider.disconnect();
		props.callback({ web3: null, accounts: null, contract: null });
		history.push('/');
	}

	// If not connected, display the connect button.
	if (!props.connected) return <button className="login" onClick={DoConnect}>Connect Wallet</button>;

	// Display the wallet address. Truncate it to save space.
	//return <>[{props.address.slice(0,6)}]</>;
	return <button className="login" onClick={Disconnect}>{props.address.slice(0, 6)}...</button>
}