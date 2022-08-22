const { ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function({ getNamedAccounts }) {
    const { deployer } = await getNamedAccounts()

    // const basicNFT = await ethers.getContract("BasicNFT", deployer)
    // const basicMintTx = await basicNFT.mintNft()
    // await basicMintTx.wait(1)
    // console.log(`Basic NFT index 0 has tokenURI: ${await basicNFT.tokenURI(0)}`)

    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
    const mintFee = await randomIpfsNft.getMintFee()

    await new Promise(async (resolve, reject) => {
        setTimeout(resolve, 60 * 1000 * 5)
        randomIpfsNft.once("NFTMinted", async function() {
            resolve()
        })

        const randomMintTx = await randomIpfsNft.requestNft({
            value: mintFee.toString()
        })
        const ramdomMintTxReceipt = await randomMintTx.wait(1)

        if (developmentChains.includes(network.name)) {
            const requestId = ramdomMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract(
                "VRFCoordinatorV2Mock",
                deployer
            )
            await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestId,
                randomIpfsNft.address
            )
        }
    })
    console.log(
        `Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`
    )
}

module.exports.tags = ["all", "mint"]
