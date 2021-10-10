import detectEthereumProvider from "@metamask/detect-provider";
import { BigNumber, constants, Contract, ethers, utils } from "ethers";
import { createPetImg } from "./image";

const CHAIN_ID = "0x13881";
const RPC_ENDPOINT = "https://matic-mumbai.chainstacklabs.com";

const peggedAddress = "0xA9ea45b548Ba2F9A4071A91898bDD2401b1660d4";
const peggedAbi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const coinAddress = "0x0110afAe91d6D822f333F65826C22E81C9d51d7B";
const coinAbi = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"erc20","type":"address"}],"name":"claimERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const petAddress = "0xeDdFE664aa5ABce9cF2474F4b7c758b2e36a6882";
const petAbi = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"CONTROLLER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"parent1","type":"uint256"},{"internalType":"uint256","name":"parent2","type":"uint256"}],"name":"breed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"count","type":"uint256"}],"name":"bulkMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"erc20","type":"address"}],"name":"claimERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contractURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id1","type":"uint256"},{"internalType":"uint256","name":"id2","type":"uint256"},{"internalType":"uint256","name":"id3","type":"uint256"}],"name":"explore","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getLevelUpExpFor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getLevelUpExpenseFor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getPetInfo","outputs":[{"components":[{"components":[{"internalType":"uint8[32]","name":"genes","type":"uint8[32]"}],"internalType":"struct GeneLib.Genes","name":"genes","type":"tuple"},{"internalType":"uint32","name":"bornAt","type":"uint32"},{"internalType":"uint32","name":"recoveryAt","type":"uint32"},{"internalType":"uint32","name":"parent1","type":"uint32"},{"internalType":"uint32","name":"parent2","type":"uint32"},{"internalType":"uint16","name":"exp","type":"uint16"},{"internalType":"uint16","name":"nextExp","type":"uint16"},{"internalType":"uint8","name":"state","type":"uint8"},{"internalType":"uint8","name":"level","type":"uint8"},{"internalType":"uint8","name":"breedCount","type":"uint8"}],"internalType":"struct PetToken.PetInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"levelUp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"genes","type":"uint256"}],"name":"mintWithGenes","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"uri","type":"string"},{"internalType":"string","name":"suffix","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"uri","type":"string"}],"name":"setContractURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IPetScientist","name":"petScientist","type":"address"}],"name":"setPetScientist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"train","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const coreAddress = "0xefDeF2b0CFCeC9aa6aa9eCd0C26c0f67a30999f1";
const coreAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"beacon","outputs":[{"internalType":"contract IBeacon","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId1","type":"uint256"},{"internalType":"uint256","name":"tokenId2","type":"uint256"}],"name":"breed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"breedingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"checkIn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"erc20","type":"address"}],"name":"claimERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentEnergy","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId1","type":"uint256"},{"internalType":"uint256","name":"tokenId2","type":"uint256"},{"internalType":"uint256","name":"tokenId3","type":"uint256"}],"name":"explore","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"hatchingCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"levelUp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"nextCheckInAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IBeacon","name":"target","type":"address"}],"name":"setBeacon","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"name":"setBreedingFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"train","outputs":[],"stateMutability":"nonpayable","type":"function"}];

let currentAccount: string|undefined;
let currentNetwork: string|undefined;

window.addEventListener("load", () => {
  setupWallet();
  setupTimer();
});

async function setupWallet() {
  const button = document.getElementById("wallet-badge") as HTMLElement;
  const provider = await detectEthereumProvider({ silent: true });
  if (provider == null) {
    button.addEventListener("click", (e) => {
      alert("no metamask detected");
      location.href = "https://metamask.app.link/dapp/game-data.gameindy.com/nft/scb10x/";
    });
    return;
  }

  const ethereum: any = window.ethereum;
  if (ethereum === undefined) return;

  const accounts = await ethereum.request({ method: 'eth_accounts' });
  if (accounts.length > 0) currentAccount = accounts[0];
  currentNetwork = await ethereum.request({ method: 'eth_chainId' });

  updateWalletBadge(button);
  render().catch(console.error);

  ethereum.on("accountsChanged", (accounts: string[]) => {
    if (accounts.length <= 0) return;
    currentAccount = accounts[0];
    updateWalletBadge(button);
    render().catch(console.error);
  });
  
  ethereum.on("chainChanged", (chainId: string) => {
    currentNetwork = chainId;
    updateWalletBadge(button);
    render().catch(console.error);
    // window.location.reload();
  });

  button.addEventListener("click", (e) => {
    if (currentAccount == null) {
      ethereum.request({ method: "eth_requestAccounts" }).catch(console.error);
      return;
    }
    if (currentNetwork != CHAIN_ID) {
      switchChain().catch(console.error);
      return;
    }
  });
}

function updateWalletBadge(button: HTMLElement) {
  if (currentNetwork != CHAIN_ID) {
    button.innerHTML = `<span style="color: red">incorrect chain</span>`;
    return;
  }
  if (currentAccount != null) {
    button.innerText = currentAccount;
    return;
  }
}

async function switchChain() {
  const ethereum: any = window.ethereum;
  if (ethereum === undefined) return;
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CHAIN_ID }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{ chainId: CHAIN_ID, rpcUrl: RPC_ENDPOINT }],
        });
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
}

function setupTimer() {
  setInterval(() => {
    const elems = document.getElementsByClassName("cooldown");
    const now = Math.floor(Date.now() / 1000);
    for (let i = 0; i < elems.length; ++i) {
      const e = elems[i] as HTMLElement;
      const cooldown = e.dataset.cooldown;
      if (cooldown == undefined) return;
      const seconds = Math.max(parseInt(cooldown) - now, 0);
      e.innerText = toDuration(seconds);
    }
  }, 1000);
}

async function render() {  
  if (currentAccount === undefined) return;
  const ethereum: any = window.ethereum;
  if (ethereum === undefined) return;

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner()
  const core = new ethers.Contract(coreAddress, coreAbi, signer);
  const pet = new ethers.Contract(petAddress, petAbi, signer);
  const ingame = new ethers.Contract(coinAddress, coinAbi, signer);
  const pegged = new ethers.Contract(peggedAddress, peggedAbi, signer);

  refreshPeggedCoin(pegged);
  refreshIngameCoin(ingame);
  refreshEnergy(core);
  refreshCheckin(core);

  refreshMonsters(pet, ingame, core);

  // setup button
  const checkin = document.getElementById("check-in");
  if (checkin != null) {
    checkin.onclick = async (e) => {
      try {
        e.preventDefault();
        const tx = await core.checkIn();
        await tx.wait();
        refreshIngameCoin(ingame);
        refreshCheckin(core);
        alert("done");
      } catch (e: any) {
      alert(e?.data?.message || e);
      }
    }
  }

  const hatch = document.getElementById("hatch");
  if (hatch != null) {
    hatch.onclick = async (e) => {
      try {
        e.preventDefault();
        if (utils.parseEther("10.0").gt(await pegged.allowance(currentAccount, core.address))) {
          await (await pegged.approve(core.address, constants.MaxUint256)).wait();
        }
        const tx = await core.hatch();
        await tx.wait();
        refreshPeggedCoin(pegged);
        refreshEnergy(core);
        refreshMonsters(pet, ingame, core);
        alert("done");
      } catch (e: any) {
      alert(e?.data?.message || e);
      }
    }
  }

  const explore = document.getElementById("explore");
  if (explore != null) {
    explore.onclick = async (e) => {
      try {
        e.preventDefault();
        const id1 = getInputValue("explorer1");
        const id2 = getInputValue("explorer2");
        const id3 = getInputValue("explorer3");
        const tx = await core.explore(id1, id2, id3);
        await tx.wait();
        refreshIngameCoin(ingame);
        refreshEnergy(core);
        refreshMonsters(pet, ingame, core);
        alert("done");
      } catch (e: any) {
      alert(e?.data?.message || e);
      }
    }
  }

  const train = document.getElementById("train");
  if (train != null) {
    train.onclick = async (e) => {
      try {
        e.preventDefault();
        const id = getInputValue("train-id");
        const tx = await core.train(id);
        await tx.wait();
        refreshEnergy(core);
        refreshMonsters(pet, ingame, core);
        alert("done");
      } catch (e: any) {
      alert(e?.data?.message || e);
      }
    }
  }

  const levelUp = document.getElementById("level-up");
  if (levelUp != null) {
    levelUp.onclick = async (e) => {
      try {
        e.preventDefault();
        if (utils.parseEther("100.0").gt(await ingame.allowance(currentAccount, core.address))) {
          await (await ingame.approve(core.address, constants.MaxUint256)).wait();
        }
        const id = getInputValue("level-up-id");
        const tx = await core.levelUp(id);
        await tx.wait();
        refreshIngameCoin(ingame);
        refreshMonsters(pet, ingame, core);
        alert("done");
      } catch (e: any) {
      alert(e?.data?.message || e);
      }
    }
  }

  const breed = document.getElementById("breed");
  if (breed != null) {
    breed.onclick = async (e) => {
      try {
        e.preventDefault();
        if (utils.parseEther("2.0").gt(await pegged.allowance(currentAccount, core.address))) {
          await (await pegged.approve(core.address, constants.MaxUint256)).wait();
        }
        if (utils.parseEther("5.0").gt(await ingame.allowance(currentAccount, core.address))) {
          await (await ingame.approve(core.address, constants.MaxUint256)).wait();
        }

        const parent1 = getInputValue("parent1");
        const parent2 = getInputValue("parent2");
        const tx = await core.breed(parent1, parent2, { gasLimit: 400000 });
        await tx.wait();
        refreshPeggedCoin(pegged);
        refreshIngameCoin(ingame);
        refreshMonsters(pet, ingame, core);
        alert("done");
      } catch (e: any) {
      alert(e?.data?.message || e);
      }
    }
  }
}

function refreshPeggedCoin(pegged: Contract) {
  catchAll(pegged.balanceOf(currentAccount).then((n: BigNumber) => {
    const text = document.getElementById("pegged-coin");
    if (text != null) text.innerText = ethers.utils.formatEther(n);
  }));  
}

function refreshIngameCoin(ingame: Contract) {
  catchAll(ingame.balanceOf(currentAccount).then((n: BigNumber) => {
    const text = document.getElementById("ingame-coin");
    if (text != null) text.innerText = ethers.utils.formatEther(n);
  }));
}

function refreshEnergy(core: Contract) {
  catchAll(core.currentEnergy().then((result: BigNumber[]) => {
    const label = document.getElementById("energy");
    if (label == null) return;
    label.innerText = `${result[0].toString()} / ${result[1].toString()} `;
    const time = document.createElement("span");
    time.className = "cooldown";
    time.dataset.cooldown = result[2].toString();
    label.appendChild(time);
  }));
}

function refreshCheckin(core: Contract) {
  catchAll(core.nextCheckInAt().then((n: BigNumber) => {
    const text = document.getElementById("check-in-time");
    if (text == null) return;
    text.className = "cooldown";
    text.dataset.cooldown = n.toString();
  }));
}

function refreshMonsters(pet: Contract, ingame: Contract, core: Contract) {
  catchAll((async () => {
    const n: BigNumber = await pet.balanceOf(currentAccount);
    const monsters = document.getElementById("monsters");
    if (monsters != null) monsters.innerText = n.toString();
    const content = document.getElementById("content");
    if (content == null) return;
    if (n.toNumber() == 0) {
      content.innerText = "no monster";
      return;
    }
    const petPromises: Promise<HTMLElement>[] = [];
    for (let i = 0; i < n.toNumber(); ++i) {
      petPromises.push((async (): Promise<HTMLElement> => {
        const tokenId: BigNumber = await pet.tokenOfOwnerByIndex(currentAccount, i);
        const info: any = await pet.getPetInfo(tokenId);
        const d = document.createElement("div");
        d.className = "monster-container";
        const label = document.createElement("div");
        label.innerText = `#${tokenId} - Lv.${info.level} - ${info.exp} / ${info.nextExp}`;
        label.className = "monster-label";
        d.appendChild(label);
        const appearance = document.createElement("img");
        appearance.className = "monster-appearance";
        const now = Math.floor(Date.now() / 1000);
        if (info.state != 1 || info.recoveryAt < now) {
          const genes: number[] = [];
          for (let i = 0; i < 8; ++i) genes[i] = info.genes.genes[i * 4];
          catchAll(createPetImg(genes).then((img) => appearance.src = img));  
        } else {
          appearance.src = "img/egg.png";
        }
        d.appendChild(appearance);
        const breed = document.createElement("div");
        breed.className = "monster-breed";
        breed.innerHTML = `breed: ${info.breedCount} (#${info.parent1} + #${info.parent2})`;
        d.appendChild(breed);
        if (info.recoveryAt > now) {
          const cooldownLabel = document.createElement("div");
          cooldownLabel.className = "monster-cooldown";
          cooldownLabel.innerText = getState(info.state) + " ";
          const cooldownTime = document.createElement("span");
          cooldownTime.className = "cooldown";
          cooldownTime.dataset.cooldown = info.recoveryAt;
          cooldownLabel.appendChild(cooldownTime);
          d.appendChild(cooldownLabel);
        }
        d.onclick = (e) => {
          const modal = document.getElementById("monster-menu-modal");
          if (modal == null) return;
          modal.style.display = "block";
          const train = document.getElementById("monster-menu-train");
          if (train != null) {
            train.onclick = (e) => {
              trainMonster(tokenId, pet, ingame, core);
            };
          }
          const levelUp = document.getElementById("monster-menu-level-up");
          if (levelUp != null) {
            levelUp.onclick = (e) => {
              levelUpMonster(tokenId, pet, ingame, core);
            };
          }
          const send = document.getElementById("monster-menu-send");
          if (send != null) {
            send.onclick = (e) => {
              sendMonster(tokenId, pet, ingame, core);
            };
          }
        };
        d.dataset.id = tokenId.toString();
        return d;
      })());
    }
    const elems = await Promise.all(petPromises);
    elems.sort((a, b) => {
      return parseInt(a.dataset.id ?? "0") - parseInt(b.dataset.id ?? "0");
    });
    content.innerText = "";
    for (let e of elems)
      content.appendChild(e);
  })());
}

function trainMonster(id: string|BigNumber, pet: Contract, ingame: Contract, core: Contract) {
  catchAll((async () => {
    try {
      const tx = await core.train(id);
      await tx.wait();
      refreshEnergy(core);
      refreshMonsters(pet, ingame, core);
      alert("done");
    } catch (e: any) {
      alert(e?.data?.message || e);
    }
  })());
}

function levelUpMonster(id: string|BigNumber, pet: Contract, ingame: Contract, core: Contract) {
  catchAll((async () => {
    try {
      if (utils.parseEther("100.0").gt(await ingame.allowance(currentAccount, core.address))) {
        await (await ingame.approve(core.address, constants.MaxUint256)).wait();
      }
      const tx = await core.levelUp(id);
      await tx.wait();
      refreshIngameCoin(ingame);
      refreshMonsters(pet, ingame, core);
      alert("done");
    } catch (e: any) {
      alert(e?.data?.message || e);
    }
  })());
}

function sendMonster(id: string|BigNumber, pet: Contract, ingame: Contract, core: Contract) {
  catchAll((async () => {
    try {
      const to = prompt("enter receiver address");
      if (to == null) return;
      console.log(currentAccount, to, id);
      const tx = await pet['safeTransferFrom(address,address,uint256)'](currentAccount, to, id);
      await tx.wait();
      refreshMonsters(pet, ingame, core);
      alert("done");
    } catch (e: any) {
      alert(e?.data?.message || e);
    }
  })());
}

function toDuration(n: number): string {
  const seconds = n % 60; n = Math.floor(n / 60);
  const minutes = n % 60; n = Math.floor(n / 60);
  const hours = n % 60; n = Math.floor(n / 24);
  const r: string[] = [];
  if (n > 0) r.push(`${n}d`);
  if (n > 0 || hours > 0) r.push(`${hours}h`);
  if (n > 0 || hours > 0 || minutes > 0) r.push(`${minutes}m`);
  r.push(`${seconds}s`);
  return r.join(" ");
}

function getInputValue(id: string): string {
  const input = document.getElementById(id) as HTMLInputElement;
  return input.value;
}

function getState(s: number): string {
  switch (s) {
    case 1: return "incubation";
    case 2: return "breeding";
    case 3: return "exploration";
    case 4: return "training";
  }
  return "unknown";
}

function catchAll<T>(p: Promise<T>) {
  p.catch(console.error);
}

function compareAddress(a1: string|undefined, a2: string|undefined): boolean {
  if (a1 == undefined || a2 == undefined) return false;
  return a1.toLowerCase() == a2.toLowerCase();
}