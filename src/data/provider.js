import { ethers } from "ethers";

let exportValue
try {
    exportValue = new ethers.providers.Web3Provider(window.ethereum)
} catch {
    exportValue = 0
}

export default exportValue