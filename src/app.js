// Modern dapp browsers...

let web3Provider =
    "wss://ropsten.infura.io/ws/v3/aae71ad4abb14859a9a7b91c34f8839e"
let web3 = null
let DGLDonationAddress = "0x309543420B56b39F806144bA5e7dbD8FDc638d6f"
let DGLDonationContract = null

// async function initWeb3() {
//     let _web3 = null
//     _web3 = new Web3(_web3Provider)

//     return _web3
// }

function startApp() {
    web3 = new Web3(web3Provider)
    fetch("../build/DGLDonation.json").then((response) => {
        response.json().then((data) => {
            DGLDonationContract = new web3.eth.Contract(
                data.abi,
                DGLDonationAddress
            )

            DGLDonationContract.methods
                .checkPoints()
                .call()
                .then((r) => console.log(r))
console.log(ethereum.selectedAddress)
            // ethereum
            //     .request({
            //         params: [
            //             {
            //                 from: ethereum.selectedAddress,
            //                 to: DGLDonationAddress,
            //             },
            //         ],
            //     })
            //     .then((txHash) => console.log(txHash))
            //     .catch((error) => console.error)
        })
    })
}

window.addEventListener("load", async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
        try {
            // Request account access
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            // User denied account access...
            console.error("User denied account access")
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        web3Provider = window.web3.currentProvider
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
        web3Provider = new Web3.providers.HttpProvider("http://localhost:7545")
    }
    console.log(web3Provider)
    // Now you can start your app & access web3 freely:
    startApp()
})
