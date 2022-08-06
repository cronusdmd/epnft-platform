import React, { useState, useCallback } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useHistory
} from 'react-router-dom';

import './App.css';

import Home from './pages/home';
import Mint from './pages/mint';
import ENFT from './pages/enft';
import PNFT from './pages/pnft';
import Login from './components/Login';


function App() {

	const [web3props, setWeb3Props] = useState({ web3: null, accounts: null, contract: null });
	const [netID, setNetID] = useState(null);

	// Callback function for the Login component to give us access to the web3 instance and contract functions
	const OnLogin = function(param){
		//const history = useHistory();
		let { web3, accounts, contract, netId } = param;
		if(web3 && accounts && accounts.length && contract){
			setWeb3Props({ web3, accounts, contract });
			setConFlag(true);
			setNetID(netId);
		}
		else {
			setConFlag(null);
		}
	}

	// If the wallet is connected, all three values will be set. Use to display the main nav below.
	const [conFlag, setConFlag] = useState(null);
	// Grab the connected wallet address, if available, to pass into the Login component
	const walletAddress = web3props.accounts ? web3props.accounts[0] : "";

	return (
		<div className="App">
			<Router>
				<header>
					<Link to="/">
						<h1 id="logo" style={{paddingBottom: "3px"}}>EPNFT</h1>
					</Link>
					<nav>
						<ul>
								{conFlag && <>
									<li>
										<Link to="/mint">Mint</Link>
									</li>
									<li>
										<Link to="/enft">My ENFTs</Link>
									</li>
									<li>
										<Link to="/pnft">My PNFTs</Link>
									</li>
								</>}
								<li>
									<Login callback={OnLogin} connected={conFlag} address={walletAddress}></Login>
								</li>
						</ul>
					</nav>
				</header>
				<div className="content">
					<Switch>
						<Route path="/pnft">
							<PNFT contract={web3props.contract} address={walletAddress} network={netID}></PNFT>
						</Route>
						<Route path="/enft">
							<ENFT contract={web3props.contract} address={walletAddress} network={netID}></ENFT>
						</Route>
						<Route path="/mint">
							<Mint contract={web3props.contract} address={walletAddress}></Mint>
						</Route>
						<Route path="/">
							<Home />
						</Route>
					</Switch>
				</div>
			</Router>
		</div>
	);
}

export default App;
