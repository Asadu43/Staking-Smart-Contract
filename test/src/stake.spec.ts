const { network, ethers, deployments } = require("hardhat")
import { expect } from "chai";
import { Contract } from "ethers";
import { RewardToken, RewardToken__factory } from "../../typechain";

let staking: Contract;
let rewardToken: RewardToken;
let deployer: any;
let stakeAmount: any;

describe.only("Staking TEST", async function () {


  before(async function () {
    const accounts = await ethers.getSigners()
    deployer = await accounts[0]

    const MasterInstance = await ethers.getContractFactory("RewardToken");
    rewardToken = await MasterInstance.deploy();
    const Staking = await ethers.getContractFactory("Staking")

    staking = await Staking.deploy(rewardToken.address, rewardToken.address);
    stakeAmount = ethers.utils.parseEther("100000")
  })


  async function increaseTime(n: any): Promise<void> {
    for (let index = 0; index < n; index++) {
      await ethers.provider.send('evm_mine');
    }

  }


  it("Approve Token ", async function () {
    // console.log(rewardToken.functions)
    await rewardToken.approve(staking.address, stakeAmount)
  })

  it("Stake Token ", async function () {
    await staking.connect(deployer).stake(stakeAmount) // 100000 tokens
  })

  it("REWARD Token ", async function () {
    increaseTime(200)
    // console.log(await staking.connect(deployer).claimedReward())
    console.log(await staking.reward(deployer.address))
    await staking.connect(deployer).claimedReward()
  })


  it("REWARD Token 2 ", async function () {
    increaseTime(20)
    // console.log(await staking.connect(deployer).claimedReward())
    console.log(await staking.reward(deployer.address))
    await staking.connect(deployer).claimedReward()
  })

  it("WithDraw ", async function () {
    await staking.connect(deployer).withdraw(ethers.utils.parseEther("50000"))
    expect(await staking.sTake_balances(deployer.address)).to.be.equal(ethers.utils.parseEther("50000"))
  })

})