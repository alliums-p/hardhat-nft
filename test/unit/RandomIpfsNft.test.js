const { assert, expect } = require("chai")
const { network, ethers, getNamedAccounts, deployments } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("RandomIpfsNft Unit Test", async function() {
          let randomIpfs, deployer, fee, randomUser, vrfCoordinatorV2Mock

          beforeEach(async () => {
              const accounts = await getNamedAccounts()
              deployer = accounts.deployer
              randomUser = accounts.randomUser

              await deployments.fixture(["mocks", "randomipfs"])
              randomIpfs = await ethers.getContract("RandomIpfsNft")
              fee = await randomIpfs.getMintFee()
              vrfCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock"
              )
          })

          describe("constructor", async function() {
              it("sets initializing values correctly", async function() {
                  const dogTokenUri = await randomIpfs.getDogTokenUris(0)
                  assert(dogTokenUri.includes("ipfs://"))
                  const mintFee = await randomIpfs.getMintFee()
                  assert.equal(mintFee.toString(), fee.toString())
              })
          })

          describe("requestNft", async function() {
              it("reverts if not enough fee is sent", async function() {
                  const ethFee = ethers.utils.parseEther("0.0005")
                  await expect(
                      randomIpfs.requestNft({ value: ethFee })
                  ).to.be.revertedWith("RandomIpfsNft__NeedMoreETHSent()")
              })

              it("emits nft request event", async function() {
                  await expect(
                      randomIpfs.requestNft({ value: fee.toString() })
                  ).to.emit(randomIpfs, "NFTRequested")
              })
          })

          describe("fulfillRandomWords", async () => {
              it("mints NFT after chainlink sends a random number", async function() {
                  await new Promise(async (resolve, reject) => {
                      randomIpfs.once("NFTMinted", async () => {
                          try {
                              const counter = await randomIpfs.getTokenCounter()
                              assert.equal(counter.toString(), "1")
                              resolve()
                          } catch (err) {
                              console.log(err)
                              reject(err)
                          }
                      })

                      try {
                          const tx = await randomIpfs.requestNft({
                              value: fee.toString()
                          })
                          const txReceipt = await tx.wait(1)
                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              txReceipt.events[1].args.requestId,
                              randomIpfs.address
                          )
                      } catch (error) {
                          console.log(error)
                          reject(error)
                      }
                  })
              })
          })

          describe("withdraw", async function() {
              it("only allows owner to withdraw", async function() {
                  const accounts = await ethers.getSigners()
                  const randomConnect = await randomIpfs.connect(accounts[1])
                  await expect(randomConnect.withdraw()).to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )
              })
          })
      })
