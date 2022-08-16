const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const { verify } = require("../utils/verify")

module.exports = async function({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("========================")
    let arguments = []
    const basicNft = await deploy("BasicNFT", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying contract...")
        await verify(basicNft.address, args)
    }

    log("==========================")
}
