const { network, ethers, deployments } = require("hardhat")
import { Contract } from "ethers";
import { RewardToken, RewardToken__factory } from "../../typechain";

let staking:Contract;
let rewardToken:RewardToken;
let deployer:any;
let stakeAmount:any;

describe("Staking APL TEST", async function () {
    

    before(async function () {
        const accounts = await ethers.getSigners()
        deployer = await accounts[0]

        const MasterInstance = await ethers.getContractFactory("RewardToken");
         rewardToken = await MasterInstance.deploy();
       const Staking = await ethers.getContractFactory("StakeAPL")

       staking = await Staking.deploy(rewardToken.address);
        stakeAmount = ethers.utils.parseEther("100000")
    })


    async function increaseTime(duration: number): Promise<void> {
      ethers.provider.send("evm_increaseTime", [duration]);
      ethers.provider.send("evm_mine", []);
    }


    it("Approve Token ", async function () {
      console.log(rewardToken.functions)
        await rewardToken.approve(staking.address, stakeAmount)
    })

    it("Stake Token ", async function () {
      await staking.stakeToken(stakeAmount) // 100000 tokens
    })


    it("Staked Token ", async function () {
      // console.log(await staking.getStaked(deployer.address))
      increaseTime(130)
      console.log(await staking.stakeInfos(deployer.address))
        await staking.stakeInfos(deployer.address)
    })
})