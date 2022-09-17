"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const LockedAssetAttributes_1 = require("../../models/account/LockedAssetAttributes");
const meta_esdt_service_1 = require("../meta-esdt/meta.esdt.service");
const staking_1 = require("../staking");
const constants_1 = require("../utils/constants");
let AccountsService = class AccountsService {
    constructor(elrondApiService, metaEsdtService, stakingGetterService) {
        this.elrondApiService = elrondApiService;
        this.metaEsdtService = metaEsdtService;
        this.stakingGetterService = stakingGetterService;
    }
    async getAccountDetails(address) {
        const egldBalance = await this.getEgldBalance(address);
        return { address, egldBalance };
    }
    async getEgldBalance(address) {
        return await this.elrondApiService.getAccountBalance(address);
    }
    async getEsdtTokens(address) {
        const esdtTokens = await this.elrondApiService.getEsdtTokens(address);
        const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();
        const tokenIds = farmStakingGroups
            .map((group) => group.childContracts
            .map((childContract) => [childContract.farmingTokenId, childContract.rewardTokenId])
            .flat())
            .flat();
        const uniqueLockedTokenIds = [...new Set(tokenIds.map((id) => id))];
        const result = esdtTokens.filter((token) => uniqueLockedTokenIds.firstOrUndefined((item) => item === token.identifier));
        return result;
    }
    async getLockedTokens(address) {
        const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();
        const lockedTokenIds = farmStakingGroups
            .map((group) => group.childContracts
            .map((childContract) => [childContract.farmTokenId, childContract.rewardTokenId])
            .flat())
            .flat();
        const uniqueLockedTokenIds = [...new Set(lockedTokenIds.map((id) => id))];
        const metaEsdts = await this.metaEsdtService.getMetaEsdts(address, uniqueLockedTokenIds);
        const lockedTokens = metaEsdts
            .map((token) => {
            const { unlockSchedule } = LockedAssetAttributes_1.LockedAssetAttributes.fromAttributes(token.attributes);
            return {
                ticker: token.ticker,
                collection: token.collection,
                identifier: token.identifier,
                name: token.name,
                nonce: token.nonce,
                balance: token.balance,
                decimals: token.decimals,
                assets: token.assets,
                unlockSchedule,
            };
        })
            .filter((token) => token.unlockSchedule && token.balance);
        return lockedTokens;
    }
    async getFarmTokens(address) {
        const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();
        const farmTokenIds = farmStakingGroups
            .map((group) => group.childContracts.map((childContract) => childContract.farmTokenId))
            .flat();
        const uniqueFarmTokenIds = [...new Set(farmTokenIds.map((id) => id))];
        const metaEsdts = await this.metaEsdtService.getMetaEsdts(address, uniqueFarmTokenIds);
        return metaEsdts;
    }
};
AccountsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.STAKEGOLD_ELROND_API_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [Object, meta_esdt_service_1.MetaEsdtService,
        staking_1.StakingGetterService])
], AccountsService);
exports.AccountsService = AccountsService;
//# sourceMappingURL=accounts.service.js.map