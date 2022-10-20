"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsFarmService = void 0;
const tslib_1 = require("tslib");
const out_1 = require("@elrondnetwork/erdjs/out");
const common_1 = require("@nestjs/common");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const context_transactions_service_1 = require("../../context/context.transactions.service");
const address_utils_1 = require("../../utils/address.utils");
const constants_1 = require("../../utils/constants");
const staking_getter_service_1 = require("./staking.getter.service");
let TransactionsFarmService = class TransactionsFarmService {
    constructor(elrondProxy, contextTransactions, apiConfigService, stakingGetterService) {
        this.elrondProxy = elrondProxy;
        this.contextTransactions = contextTransactions;
        this.apiConfigService = apiConfigService;
        this.stakingGetterService = stakingGetterService;
    }
    async stake(sender, groupId, args) {
        const contract = await this.elrondProxy.getRouterSmartContract();
        if (!address_utils_1.AddressUtils.isAddressValid(sender)) {
            throw new common_1.BadRequestException('Provided address is not a valid bech32 address');
        }
        const method = 'stakeFarm';
        const gasLimit = 30000000;
        if (args.tokens.length > 1) {
            return this.contextTransactions.multiESDTNFTTransfer(new out_1.Address(sender), contract, args.tokens, method, [out_1.BytesValue.fromUTF8(groupId), new out_1.BooleanValue(args.lockRewards)], gasLimit, this.apiConfigService.getChainId());
        }
        const collection = args.tokens[0].collection;
        if (collection === undefined || collection === '') {
            return this.contextTransactions.esdtTransfer(contract, args.tokens[0], method, [new out_1.BooleanValue(args.lockRewards)], gasLimit, this.apiConfigService.getChainId());
        }
        return this.SftFarmInteraction(sender, args, method, gasLimit, [
            new out_1.BooleanValue(args.lockRewards),
        ]);
    }
    async lockAndStake(sender, groupId, args) {
        const contract = await this.elrondProxy.getRouterSmartContract();
        if (!address_utils_1.AddressUtils.isAddressValid(sender)) {
            throw new common_1.BadRequestException('Provided address is not a valid bech32 address');
        }
        const method = 'lockAssetsAndStakeFarm';
        const gasLimit = 40000000;
        if (args.tokens.length > 1) {
            return this.contextTransactions.multiESDTNFTTransfer(new out_1.Address(sender), contract, args.tokens, method, [new out_1.BooleanValue(args.lockRewards), out_1.BytesValue.fromUTF8(groupId)], gasLimit, this.apiConfigService.getChainId());
        }
        const collection = args.tokens[0].collection;
        if (collection === undefined || collection === '') {
            return this.contextTransactions.esdtTransfer(contract, args.tokens[0], method, [new out_1.BooleanValue(args.lockRewards), out_1.BytesValue.fromUTF8(groupId)], gasLimit, this.apiConfigService.getChainId());
        }
        return this.SftFarmInteraction(sender, args, method, gasLimit, [
            new out_1.BooleanValue(args.lockRewards),
            out_1.BytesValue.fromUTF8(groupId),
        ]);
    }
    async mergeTokens(sender, tokens) {
        const contract = await this.elrondProxy.getRouterSmartContract();
        if (!address_utils_1.AddressUtils.isAddressValid(sender)) {
            throw new common_1.BadRequestException('Provided address is not a valid bech32 address');
        }
        if (tokens.length === 0) {
            throw new common_1.BadRequestException('Provided tokens list cannot be empty');
        }
        const gasLimit = new bignumber_js_1.default(4000000).times(tokens.length).plus(12000000).toNumber();
        const vestingAddress = await this.stakingGetterService.getGroupIdFromLockedAssetId(tokens[0].identifier);
        if (!vestingAddress) {
            throw new common_1.BadRequestException(`The vesting address hasn't been set yet`);
        }
        return this.contextTransactions.multiESDTNFTTransfer(new out_1.Address(sender), contract, tokens, 'mergeLockedAssetTokens', [out_1.BytesValue.fromHex(out_1.Address.fromBech32(vestingAddress).hex())], gasLimit, this.apiConfigService.getChainId());
    }
    async unlockToken(sender, token) {
        const contract = await this.elrondProxy.getRouterSmartContract();
        if (!address_utils_1.AddressUtils.isAddressValid(sender)) {
            throw new common_1.BadRequestException('Provided address is not a valid bech32 address');
        }
        const gasLimit = 25000000;
        const vestingAddress = await this.stakingGetterService.getGroupIdFromLockedAssetId(token.identifier);
        if (!vestingAddress) {
            throw new common_1.BadRequestException(`The vesting address hasn't been set yet`);
        }
        return this.contextTransactions.nftTransfer(new out_1.Address(sender), contract, token, 'unlockAssets', [out_1.BytesValue.fromHex(out_1.Address.fromBech32(vestingAddress).hex())], gasLimit, this.apiConfigService.getChainId());
    }
    async unstake(sender, args) {
        const method = 'unstakeFarm';
        const gasLimit = 35000000;
        return await this.SftFarmInteraction(sender, args, method, gasLimit, [
            new out_1.U32Value(args.value),
        ]);
    }
    async unbond(sender, args) {
        const method = 'unbondFarm';
        const gasLimit = 20000000;
        return await this.SftFarmInteraction(sender, args, method, gasLimit, []);
    }
    async harvest(sender, args) {
        const method = 'claimRewards';
        const gasLimit = 35000000;
        return await this.SftFarmInteraction(sender, args, method, gasLimit, []);
    }
    async reinvest(sender, args) {
        const method = 'compoundRewards';
        const gasLimit = 35000000;
        return await this.SftFarmInteraction(sender, args, method, gasLimit, []);
    }
    async SftFarmInteraction(sender, stakingArgs, method, gasLimit, args) {
        const contract = await this.elrondProxy.getRouterSmartContract();
        if (!address_utils_1.AddressUtils.isAddressValid(sender)) {
            throw new common_1.BadRequestException('Provided address is not a valid bech32 address');
        }
        if (!stakingArgs.tokens || stakingArgs.tokens.length == 0) {
            throw new common_1.BadRequestException('No tokens sent');
        }
        return this.contextTransactions.nftTransfer(new out_1.Address(sender), contract, stakingArgs.tokens[0], method, args, gasLimit, this.apiConfigService.getChainId());
    }
};
TransactionsFarmService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.STAKEGOLD_ELROND_PROXY_SERVICE)),
    tslib_1.__param(2, (0, common_1.Inject)(constants_1.STAKEGOLD_API_CONFIG_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [Object, context_transactions_service_1.ContextTransactionsService, Object, staking_getter_service_1.StakingGetterService])
], TransactionsFarmService);
exports.TransactionsFarmService = TransactionsFarmService;
//# sourceMappingURL=transactions-farm.service.js.map