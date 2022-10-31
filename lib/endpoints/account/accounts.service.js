"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const LockedAssetAttributes_1 = require("../../models/account/LockedAssetAttributes");
const meta_esdt_service_1 = require("../meta-esdt/meta.esdt.service");
const staking_1 = require("../staking");
const constants_1 = require("../utils/constants");
const utils_1 = require("../utils");
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
        const tokenIds = await Promise.all(farmStakingGroups
            .map(async (group) => {
            const groupRewardTokenId = await this.stakingGetterService.getRewardTokenIdByGroupIdentifier(group.groupId);
            const ids = group.childContracts
                .map((childContract) => [childContract.farmingTokenId, childContract.rewardTokenId])
                .flat();
            if (!ids.includes(groupRewardTokenId)) {
                ids.push(groupRewardTokenId);
            }
            return ids;
        })
            .flat())
            .then((arr) => arr.flat())
            .catch(() => []);
        console.log('tokenIds', tokenIds);
        const uniqueLockedTokenIds = [...new Set(tokenIds.map((id) => id))];
        const result = esdtTokens.filter((token) => uniqueLockedTokenIds.firstOrUndefined((item) => item === token.identifier));
        return result;
    }
    async getLockedTokens(address) {
        var _a;
        const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();
        const uniqueLockedTokenIds = await this.getLockedTokenUniqueIds(farmStakingGroups);
        if (uniqueLockedTokenIds.length === 0) {
            return [];
        }
        const metaEsdts = await this.metaEsdtService.getMetaEsdts(address, uniqueLockedTokenIds);
        const lockedTokensMap = new Map();
        for (const token of metaEsdts) {
            const { unlockSchedule } = LockedAssetAttributes_1.LockedAssetAttributes.fromAttributes(token.attributes);
            if (!unlockSchedule || !token.balance) {
                continue;
            }
            const currentStats = await this.stakingGetterService.getStats();
            unlockSchedule === null || unlockSchedule === void 0 ? void 0 : unlockSchedule.map((milestone) => {
                var _a;
                const remainingEpochs = milestone.epoch ? milestone.epoch - currentStats.epoch : 0;
                const { unlocksAtDate, unlocksAtText } = (0, utils_1.calcUnlockDateText)({
                    epochs: remainingEpochs,
                    stats: currentStats,
                    hasSteps: false,
                });
                milestone.unlockDate = (_a = `${unlocksAtText} ${unlocksAtDate}`) === null || _a === void 0 ? void 0 : _a.trim();
            });
            const lockedTokenCollection = (_a = lockedTokensMap.get(token.collection)) !== null && _a !== void 0 ? _a : { collection: token.collection, tokens: [] };
            lockedTokenCollection.tokens.push({
                ticker: token.ticker,
                collection: token.collection,
                identifier: token.identifier,
                name: token.name,
                nonce: token.nonce,
                balance: token.balance,
                decimals: token.decimals,
                assets: token.assets,
                unlockSchedule,
            });
            lockedTokensMap.set(token.collection, lockedTokenCollection);
        }
        return Array.from(lockedTokensMap.values());
    }
    async getLockedTokenUniqueIds(farmStakingGroups) {
        const lockedTokenIds = await Promise.all(farmStakingGroups
            .map(async (group) => {
            try {
                const lockedAssetTokenId = await this.stakingGetterService.getLockedAssetTokenId(group.groupId);
                return lockedAssetTokenId;
            }
            catch (_a) {
                return undefined;
            }
        })
            .flat());
        const uniqueLockedTokenIds = [
            ...new Set(lockedTokenIds.map((id) => id).filter((id) => id)),
        ];
        return uniqueLockedTokenIds;
    }
    async getFarmTokens(address) {
        const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();
        const farmTokenIds = farmStakingGroups
            .map((group) => group.childContracts.map((childContract) => childContract.farmTokenId))
            .flat();
        const uniqueFarmTokenIds = [...new Set(farmTokenIds.map((id) => id))];
        if (uniqueFarmTokenIds.length === 0) {
            return [];
        }
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