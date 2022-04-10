// Modern dapp browsers...

let web3Provider =
    "wss://ropsten.infura.io/ws/v3/aae71ad4abb14859a9a7b91c34f8839e"
let web3 = null
let DglDonationAddress = "0xFbaaffc28904ADd40dc695432BB035B8Ca1464ed"
let DglDonationContract = null
let numOfDonations = 0
let numOfWithdraws = 0
let donationTableBody = document.querySelector("#donation-table tbody")
let withdrawTableBody = document.querySelector("#withdraw-table tbody")

// Elements
const totalValueEle = document.getElementById("total-value")
const donateButton = document.getElementById("donate-button")

function startApp() {
    // Init web3
    web3 = new Web3(web3Provider)
    // Create contract instance
    fetch("./build/DGLDonation.json").then((response) => {
        // Parse data to json
        response.json().then((data) => {
            // Create instance with ABI and address
            DglDonationContract = new web3.eth.Contract(
                data.abi,
                DglDonationAddress
            )

            // Get the total value
            DglDonationContract.methods
                .totalDonation()
                .call()
                .then((_totalValue) => {
                    totalValueEle.textContent = web3.utils.fromWei(_totalValue)
                })

            // Get the number of donations
            DglDonationContract.methods
                .donationsCounter()
                .call()
                .then((_counter) => {
                    // If existed
                    if (_counter > 0) {
                        numOfDonations = _counter
                        document.getElementById(
                            "donation-total-tx"
                        ).textContent = _counter

                        // Update content of donation table
                        displayTables("donation")
                    }
                })

            // Get the number of withdraws
            DglDonationContract.methods
                .withdrawCounter()
                .call()
                .then((_counter) => {
                    // If existed
                    if (_counter > 0) {
                        numOfWithdraws = _counter
                        document.getElementById(
                            "withdraw-total-tx"
                        ).textContent = _counter

                        // Update content of withdraw table
                        displayTables("withdraw")
                    }
                })
        })
    })

    // Donate handler
    donateButton.addEventListener("click", async () => {
        const amountElement = document.getElementById("donate-amount")
        const donateAmount = parseFloat(amountElement.value)
        const messageElement = document.getElementById("donate-message")
        const donateMsg = messageElement.value

        // Check amount is greater than 0
        if (donateAmount <= 0) {
            // Display error
            displayError("Amount is invalid!")
            return
        }

        // Donate
        await donateHandler(donateAmount, donateMsg)
    })
}

function displayTables(table = "donation") {
    if (table === "donation") {
        donationTableBody.innerHTML = ""
        // Display donation table
        for (let i = 0; i < numOfDonations; i++) {
            DglDonationContract.methods
                .donations(i)
                .call()
                .then(({ amount, message, owner, timestamp }) => {
                    const tblRow = createTableRow(
                        owner,
                        amount,
                        message,
                        timestamp
                    )
                    donationTableBody.appendChild(tblRow)
                })
        }
    }

    if (table === "withdraw") {
        withdrawTableBody.innerHTML = ""
        let ownerAddress = ""

        DglDonationContract.methods
                .owner()
                .call().then(address => ownerAddress = address)

        // Display donation table
        for (let i = 0; i < numOfWithdraws; i++) {
            DglDonationContract.methods
                .withdrawRecords(i)
                .call()
                .then(({amount, message, timestamp}) => {
                    const tblRow = createTableRow(
                        ownerAddress,
                        amount,
                        message,
                        timestamp
                    )
                    withdrawTableBody.appendChild(tblRow)
                }).catch(e => console.error(e))
        }
    }
}

async function donateHandler(_donateAmount, _donateMsg) {
    // Estimate total gas
    const estimateGas = await DglDonationContract.methods
        .donate(_donateMsg)
        .estimateGas({
            gas: 5000000,
            from: ethereum.selectedAddress,
            value: web3.utils.toWei(_donateAmount.toString()),
        })

    const transactionParameters = {
        // gasPrice: await web3.eth.getGasPrice(), // customizable by user during MetaMask confirmation.
        gas: web3.utils.toHex(estimateGas), // customizable by user during MetaMask confirmation.
        to: DglDonationAddress, // Required except during contract publications.
        from: ethereum.selectedAddress, // must match user's active address.
        value: web3.utils.toHex(
            web3.utils.toWei(_donateAmount.toString()).toString()
        ), // Only required to send ether to the recipient from the initiating external account.
        data: DglDonationContract.methods.donate(_donateMsg).encodeABI(), // Optional, but used for defining smart contract creation and interaction.
    }

    ethereum
        .request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error)
}

function displayError(_message) {
    const errorElement = document.getElementById("donate-error")
    errorElement.textContent = _message
    errorElement.classList.remove("d-none")
}

function createTableRow(_fromAddress, _amount, _message, _datetime) {
    const row = document.createElement("tr")

    // From column
    const fromCol = document.createElement("th")
    fromCol.setAttribute("scope", "row")
    fromCol.textContent = _fromAddress

    // Amount column
    const amountCol = document.createElement("td")
    amountCol.textContent = web3.utils.fromWei(_amount)

    // Message column
    const messageCol = document.createElement("td")
    messageCol.textContent = _message

    // Datetime column
    const datetimeCol = document.createElement("td")
    datetimeCol.textContent = new Date(_datetime * 1000).toLocaleDateString(
        "en-US",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }
    )

    row.appendChild(fromCol)
    row.appendChild(amountCol)
    row.appendChild(messageCol)
    row.appendChild(datetimeCol)

    return row
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
