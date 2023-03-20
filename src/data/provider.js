import { ethers } from "ethers";

let exportValue
try {
    exportValue = new ethers.providers.Web3Provider(window.ethereum)
} catch {
    exportValue = {}
}

export default exportValue