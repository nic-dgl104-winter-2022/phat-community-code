# Phat's Community Coding Project

## Introduction
This application is a crowdfunding application in which the users donate ETH to the **DGL Donation** through a smart contract. In other words, the donation process has no intermediary and directly sends cryptocurrencies from the user wallet to the organization. The data about donations are public, and any transaction can be seen in the network, including withdrawal transactions.

I decided to choose Ropsten as the testnet for this application because it is a personal project. It only transfers "fake money" on the testnet for the demonstration.

I use [Remix](https://remix.ethereum.org/) to code and compile the smart contract. On the other hand, the web application only use plain JavaScript. There are other libraries I use for this project:

- [Bootstrap v4](https://getbootstrap.com/docs/4.6/getting-started/introduction/)
- [Web3.js](https://web3js.readthedocs.io/en/v1.7.1/index.html)
- [OpenZeppelin](https://docs.openzeppelin.com/)

***The project requires the users to install MetaMask for the donate feature.***

## Files
Filename | Description
--- | ---
build/DGLDonation.json | It uses to communicate between the application and contract
contracts/DGLDonation.sol | This file is the main contract that handles the logic of the application. It receives donations and allows the creator to withdraw.
contract/*.sol | Utilities files from **OpenZeppelin**
app.js | Get data and send transaction
index.html | Main webpage

## Code description
