import React, { useState } from 'react';

// IMPORTANT NOTE: In this example, the URI is used as a unique key to identify
// a token associated with an asset. This is fine for demonstration, but in a 
// production project you should have a unique key associated with the asset
// and store that in the contract along with the URI.
export default function Mint(props) {

	const [assetURIs, setAssetURIs] = useState([]);

	// Populate the assetURIs variable with tokens that are not yet minted.
	const CheckAssetURIs = async () => {
		let uris = [];

		let amount = await props.contract.methods.balanceOf(props.address).call();
		console.log(amount);
		let jsondata = await props.contract.methods.tokenURI(1).call();
			console.log("json: ", jsondata);
		// For this demo there are only 4 assets, named sequentially. 
		// for(let idx = 1; idx <= 4; idx++ ){
		// 	let uri = '/token_data/exobit_'+idx+'.json';
		// 	// Call the contract and get the id of the uri. If the uri doesn't belong to a token, it will return 0.
		// 	let tokenId = await props.contract.methods.tokenByUri(uri).call();
		// 	// The token ID comes in as a string. "0" means that uri is not associated with a token.
		// 	if(tokenId === "0") uris.push(uri);
		// }

		// // Update the list of available asset URIs
		// if(uris.length) setAssetURIs([...uris]);
	}

	// Handle the click to mint
	const DoMint = async (tokenURI) => {
		console.log('minting: ', tokenURI);
		try{
			// Estimate the gas required for the transaction
			// let gasLimit = await props.contract.methods.mintNFT().estimateGas(
			// 	{ 
			// 		from: props.address, 
			// 		value: 100000000000000
			// 	}
			// );
			// Call the mint function.
			// let gasAmount;
			// await props.contract.methods.mintNFT().estimateGas({gas: 5000000}, function(error, gasAmount){
			// 	if(gasAmount == 5000000)
			// 		console.log('Method ran out of gas');
			// });
			let result = await props.contract.methods.mintNFT()
				.send({ 
					from: props.address, 
					value: 10000000000000000,
					// Setting the gasLimit with the estimate accuired above helps ensure accurate estimates in the wallet transaction.
					gasLimit: 5000000
			});
			
			

			//let result = await props.contract.methods.name();
			// Output the result for the console during development. This will help with debugging transaction errors.
			console.log('result', result);
			if(result.blockHash != null) alert("Successfully Minted!");

			// Refresh the gallery
			//CheckAssetURIs();

		}catch(e){
			console.error('There was a problem while minting', e);
		}
	};

	// Handle contract unavailable. 
	// This is an extra precaution since the user shouldn't be able to get to this page without connecting.
	if(!props.contract) return (<div className="page error">Please connect your wallet to this dapp, and try to mint the NFT.</div>);

	// Set up the list of available token URIs when the component mounts.
	//if(!assetURIs.length) CheckAssetURIs();

	// Display the minting gallery
	return (
		<div className="page mint">
			<h2>Please mint your NFTs by clicking mint buttion</h2>
			<button class="mint" onClick={CheckAssetURIs}>Mint NFT</button>
			{assetURIs.map((uri, idx) => (
					<div onClick={() => DoMint(uri)} key={idx}>
						<img src={uri.replace('.json', '.png')} alt={'exobit_'+(idx+1)} />
					</div>
				)
			)}
		</div>
	);
}