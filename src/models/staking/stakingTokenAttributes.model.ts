import {
    BigUIntType,
    FieldDefinition,
    StructType,
    U64Type,
} from '@elrondnetwork/erdjs/out';

export enum StakingTokenType {
    STAKING_FARM_TOKEN = 'stakingFarmToken',
    UNBOND_FARM_TOKEN = 'unboundFarmToken',
}

export class StakingTokenAttributesModel {
    identifier?: string;
    attributes?: string;
    rewardPerShare?: string;
    compoundedReward?: string;
    currentFarmAmount?: string;

    constructor(init?: Partial<StakingTokenAttributesModel>) {
        Object.assign(this, init);
    }

    toJSON() {
        return {
            rewardPerShare: this.rewardPerShare,
            compoundedReward: this.compoundedReward,
            currentFarmAmount: this.currentFarmAmount,
        };
    }

    static fromDecodedAttributes(
        decodedAttributes: any,
    ): StakingTokenAttributesModel {
        return new StakingTokenAttributesModel({
            rewardPerShare: decodedAttributes.rewardPerShare.toFixed(),
            compoundedReward: decodedAttributes.compoundedReward.toFixed(),
            currentFarmAmount: decodedAttributes.currentFarmAmount.toFixed(),
        });
    }

    static getStructure(): StructType {
        return new StructType('StakingFarmTokenAttributes', [
            new FieldDefinition('rewardPerShare', '', new BigUIntType()),
            new FieldDefinition('compoundedReward', '', new BigUIntType()),
            new FieldDefinition('currentFarmAmount', '', new BigUIntType()),
        ]);
    }
}

export class UnbondTokenAttributesModel {
    identifier?: string;
    attributes?: string;
    type = StakingTokenType.UNBOND_FARM_TOKEN;
    remainingEpochs?: number;

    constructor(init?: Partial<UnbondTokenAttributesModel>) {
        Object.assign(this, init);
    }

    toJSON() {
        return {
            type: this.type,
            unlockEpoch: this.remainingEpochs,
        };
    }

    static getStructure(): StructType {
        return new StructType('UnboundFarmTokenAttributes', [
            new FieldDefinition('unlockEpoch', '', new U64Type()),
        ]);
    }
}
