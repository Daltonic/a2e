const hre = require('hardhat')
const fs = require('fs')
const path = require('path')
const networkName = hre.network.name
const networkChainId = hre.network.config.chainId

async function main() {
  const Contract = await hre.ethers.getContractFactory('AnswerToEarn')
  const contract = await Contract.deploy()

  await contract.deployed()
  const filePath = path.join(
    __dirname,
    '..',
    'src',
    'contracts',
    'contractAddress.json'
  )

  let addresses = {}
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8')
    if (data) addresses = JSON.parse(data)
  }

  addresses[networkChainId] = contract.address

  fs.writeFile(filePath, JSON.stringify(addresses, null, 2), 'utf8', (err) => {
    if (err) {
      console.error(err)
      return
    }

    console.log(`Contract: ${contract.address}, deployed to: ${networkName}`)
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})