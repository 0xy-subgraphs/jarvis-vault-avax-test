import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent
} from "../generated/Vault/Vault"
import { LiquidityDeposit, LiquidityWithdraw } from "../generated/schema"
import { Vault } from "../generated/VaultEurUsd/Vault"
import { SynthereumPool } from "./synthereum-pool"
import { BigInt } from "@graphprotocol/graph-ts"

export function handleDeposit(event: DepositEvent): void {
  let entity = LiquidityDeposit.load(event.address.concat(event.transaction.from))
  let vault = Vault.bind(event.address)
  let associatedPool = SynthereumPool.bind(vault.getPool())
  let multiplier = BigInt.fromU32(10).pow(18 - associatedPool.collateralTokenDecimals() as u8)
  let depositValue = multiplier == new BigInt(0) ? event.params.netCollateralDeposited : event.params.netCollateralDeposited.times(multiplier)
  if (entity == null) {
    let entity = new LiquidityDeposit(event.address.concat(event.transaction.from))
    entity.lpAddress = event.transaction.from;
    entity.vaultAddress = event.address;
    entity.totalDeposited = depositValue;
    entity.save()
  } else {
    entity.lpAddress = event.transaction.from;
    entity.vaultAddress = event.address;
    entity.totalDeposited = entity.totalDeposited.plus(depositValue);
    entity.save()
  }
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = LiquidityWithdraw.load(event.address.concat(event.transaction.from))
  let vault = Vault.bind(event.address)
  let associatedPool = SynthereumPool.bind(vault.getPool())
  let multiplier = BigInt.fromU32(10).pow(18 - associatedPool.collateralTokenDecimals() as u8)
  let withdrawValue = multiplier == new BigInt(0) ? event.params.netCollateralOut : event.params.netCollateralOut.times(multiplier)
  if (entity == null) {
    let entity = new LiquidityWithdraw(event.address.concat(event.transaction.from))
    entity.lpAddress = event.transaction.from;
    entity.vaultAddress = event.address;
    entity.totalWithdrawn = withdrawValue;
    entity.save()
  } else {
    entity.lpAddress = event.transaction.from;
    entity.vaultAddress = event.address;
    entity.totalWithdrawn = entity.totalWithdrawn.plus(withdrawValue);
    entity.save()
  }
}
