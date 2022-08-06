//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract EPNFT is Ownable, ERC721Enumerable{

    using SafeMath for uint256;
    using Strings for uint256;

    uint256 public constant PRICE_PER_TOKEN = 0.01 ether;

    uint256 public MAX_PUBLIC_SUPPLY = 10;

    string private baseTokenURI;
    string private baseTokenURI_Ext;


    constructor() ERC721("EPNFT", "EPNFT") {
    }

    //@dev Token URI Setting Part
    function tokenURI(uint256 tokenId) public view override returns(string memory) {
        _requireMinted(tokenId);
        return string(abi.encodePacked(baseTokenURI, tokenId.toString(), baseTokenURI_Ext));
    }
    
    function setBaseTokenURI(string memory uri_, string memory ext_) public onlyOwner {
        baseTokenURI = uri_;
        baseTokenURI_Ext = ext_;
    }   
    
    function mintNFT() public payable {

        bytes memory checkStringURI = bytes(baseTokenURI);
        bytes memory checkStringEXT = bytes(baseTokenURI_Ext);

        require(PRICE_PER_TOKEN <= msg.value, "Deposited Value is not correct");
        require(totalSupply() < MAX_PUBLIC_SUPPLY, "You can't mint NFT anymore because all the tokens have already been minted.");
        require( (checkStringURI.length > 0) && (checkStringEXT.length > 0), "Minting NFT has not been started, Owner of the contract must set the Token URI");

        uint mintIndex = totalSupply() + 1;
        _safeMint(_msgSender(), mintIndex);
    }

    function withdrawFund() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
