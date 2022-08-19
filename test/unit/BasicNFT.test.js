const { assert } = require("chai")
const { getNamedAccounts, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BasicNFT Unit Tests", async function() {
          let nft, deployer

          beforeEach(async function() {
              deployer = await getNamedAccounts()
              await deployments.fixture("BasicNFT")

              nft = await ethers.getContract("BasicNFT")
          })

          describe("constructor", async function() {
              it("Has correct name and symbol set", async function() {
                  const name = await nft.name()
                  assert.equal(name, "Doggie")

                  const symbol = await nft.symbol()
                  assert.equal(symbol, "DOG")
              })
          })

          describe("mint", async function() {
              it("can mint new nft to the minter", async function() {
                  try {
                      const new_mint = await nft.mintNft()
                      await new_mint.wait(1)

                      assert(new_mint, true)
                  } catch (err) {
                      assert(false)
                  }
              })
              it("can increment the counter on mint", async function() {
                  const start_counter = await nft.getTokenCounter()
                  await nft.mintNft()
                  const end_counter = await nft.getTokenCounter()

                  assert.equal(
                      start_counter.toNumber() < end_counter.toNumber(),
                      true
                  )
              })
          })
      })
