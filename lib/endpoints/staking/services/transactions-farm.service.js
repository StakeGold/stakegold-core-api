"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsFarmService = void 0;
const tslib_1 = require("tslib");
const out_1 = require("@elrondnetwork/erdjs/out");
const common_1 = require("@nestjs/common");
const context_transactions_service_1 = require("../../context/context.transactions.service");
const address_utils_1 = require("../../utils/address.utils");
const constants_1 = require("../../utils/constants");
let TransactionsFarmService = class TransactionsFarmService {
    constructor(elrondProxy, contextTransactions, apiConfigService) {
        this.elrondProxy = elrondProxy;
        this.contextTransactions = contextTransactions;
        this.apiConfigService = apiConfigService;
    }
    async stake(sender, args) {
        const senderShard = address_utils_1.AddressUtils.computeShard(address_utils_1.AddressUtils.bech32Decode(sender));
        const contract = await this.elrondProxy.getForwarderSmartContract(senderShard);
        if (!address_utils_1.AddressUtils.isAddressValid(sender)) {
            throw new common_1.BadRequestException("Provided address is not a valid bech32 address");
        }
        const method = "stakeFarm";
        const gasLimit = 30000000;
        if (args.tokens.length > 1) {
            return this.contextTransactions.multiESDTNFTTransfer(new out_1.Address(sender), contract, args.tokens, method, [new out_1.BooleanValue(args.lockRewards)], gasLimit, this.apiConfigService.getChainId());
        }
        const collection = args.tokens[0].collection;
        if (collection === undefined || collection === "") {
            return this.contextTransactions.esdtTransfer(contract, args.tokens[0], method, [new out_1.BooleanValue(args.lockRewards)], gasLimit, this.apiConfigService.getChainId());
        }
        return this.SftFarmInteraction(sender, args, method, gasLimit, [
            new out_1.BooleanValue(args.lockRewards),
        ]);
    }
    async unstake(sender, args) {
        const method = "unstakeFarm";
        const gasLimit = 20000000;
        return await this.SftFarmInteraction(sender, args, method, gasLimit, [
            new out_1.U32Value(args.value),
        ]);
    }
    async unbond(sender, args) {
        const method = "unbondFarm";
        const gasLimit = 20000000;
        return await this.SftFarmInteraction(sender, args, method, gasLimit, []);
    }
    async harvest(sender, args) {
        const method = "claimRewards";
        const gasLimit = 35000000;
        return await this.SftFarmInteraction(sender, args, method, gasLimit, []);
    }
    async reinvest(sender, args) {
        const method = "compoundRewards";
        const gasLimit = 35000000;
        return await this.SftFarmInteraction(sender, args, method, gasLimit, []);
    }
    async SftFarmInteraction(sender, stakingArgs, method, gasLimit, args) {
        const senderShard = address_utils_1.AddressUtils.computeShard(address_utils_1.AddressUtils.bech32Decode(sender));
        const contract = await this.elrondProxy.getForwarderSmartContract(senderShard);
        if (!address_utils_1.AddressUtils.isAddressValid(sender)) {
            throw new common_1.BadRequestException("Provided address is not a valid bech32 address");
        }
        if (!stakingArgs.tokens || stakingArgs.tokens.length == 0) {
            throw new common_1.BadRequestException("No tokens sent");
        }
        return this.contextTransactions.nftTransfer(new out_1.Address(sender), contract, stakingArgs.tokens[0], method, args, gasLimit, this.apiConfigService.getChainId());
    }
};
TransactionsFarmService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.STAKEGOLD_ELROND_PROXY_SERVICE)),
    tslib_1.__param(2, (0, common_1.Inject)(constants_1.STAKEGOLD_API_CONFIG_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [Object, context_transactions_service_1.ContextTransactionsService, Object])
], TransactionsFarmService);
exports.TransactionsFarmService = TransactionsFarmService;
//# sourceMappingURL=transactions-farm.service.js.map