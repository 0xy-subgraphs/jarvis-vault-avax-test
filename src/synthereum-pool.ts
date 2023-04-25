import {
    ethereum,
    JSONValue,
    TypedMap,
    Entity,
    Bytes,
    Address,
    BigInt
} from "@graphprotocol/graph-ts";

export class SynthereumPool extends ethereum.SmartContract {
    static bind(address: Address): SynthereumPool {
        return new SynthereumPool("SynthereumPool", address);
    }

    collateralTokenDecimals(): i32 {
        let result = super.call(
            "collateralTokenDecimals",
            "collateralTokenDecimals():(uint8)",
            []
        );
        return result[0].toI32();
    }
}