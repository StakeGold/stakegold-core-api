"use strict";
var AbiStakingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbiStakingService = void 0;
const tslib_1 = require("tslib");
const out_1 = require("@elrondnetwork/erdjs/out");
const common_1 = require("@nestjs/common");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const constants_1 = require("../../utils/constants");
const generate_log_message_1 = require("../../utils/generate-log-message");
let AbiStakingService = AbiStakingService_1 = class AbiStakingService {
    constructor(elrondProxy) {
        this.elrondProxy = elrondProxy;
        this.logger = new common_1.Logger(AbiStakingService_1.name);
        this.resultParser = new out_1.ResultsParser();
    }
    async getGenericData(contract, interaction) {
        try {
            const queryResponse = await contract.runQuery(this.elrondProxy.getService(), interaction.buildQuery());
            return this.resultParser.parseQueryResponse(queryResponse, interaction.getEndpoint());
        }
        catch (error) {
            const logMessage = (0, generate_log_message_1.generateRunQueryLogMessage)(AbiStakingService_1.name, interaction.getEndpoint().name, error.message);
            this.logger.error(logMessage);
            throw error;
        }
    }
    async calculateRewardsForGivenPosition(farmAddress, amount, attributes) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methodsExplicit.calculateRewardsForGivenPosition([
            new out_1.BigUIntValue(new bignumber_js_1.default(amount)),
            out_1.BytesValue.fromHex(Buffer.from(attributes, 'base64').toString('hex')),
        ]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf();
    }
    async getContractState(farmAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.getState([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf().name;
    }
    async getFarmTokenSupply(farmAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.getFarmTokenSupply([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf().toFixed();
    }
    async getAnnualPercentageRewards(farmAddress) {
        var _a, _b;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.getAnnualPercentageRewards([]);
        const response = await this.getGenericData(contract, interaction);
        return (_b = (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf()) === null || _b === void 0 ? void 0 : _b.toFixed();
    }
    async getPerBlockRewardAmount(farmAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.getPerBlockRewardAmount([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf().toFixed();
    }
    async getLastRewardBlockNonce(farmAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.getLastRewardBlockNonce([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf().toFixed();
    }
    async getUndistributedFees(farmAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.getUndistributedFees([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf().toFixed();
    }
    async getCurrentBlockFee(farmAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.getCurrentBlockFee([]);
        const response = await this.getGenericData(contract, interaction);
        const currentBlockFee = (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf();
        return currentBlockFee ? currentBlockFee[1].toFixed() : '0';
    }
    async getRewardsPerBlock(farmAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.getPerBlockRewardAmount([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf().toFixed();
    }
    async getDivisionSafetyConstant(farmAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.getDivisionSafetyConstant([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf().toFixed();
    }
    async getProduceRewardsEnabled(farmAddress) {
        var _a, _b;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.isProduceRewardsEnabled([]);
        const response = await this.getGenericData(contract, interaction);
        return (_b = (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf()) !== null && _b !== void 0 ? _b : true;
    }
    async getRewardPerShare(farmAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.getRewardPerShare([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf().toFixed();
    }
    async getRewardsLeft(farmAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.getRewardsLeft([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf().toFixed();
    }
    async getGroupIdentifiers() {
        var _a, _b;
        const contract = await this.elrondProxy.getRouterSmartContract();
        const interaction = contract.methods.getGroupIdentifiers([]);
        const response = await this.getGenericData(contract, interaction);
        return (_b = ((_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf()).map((group) => group.toString())) !== null && _b !== void 0 ? _b : [];
    }
    async getAddressesByGroupId(groupId) {
        var _a;
        const contract = await this.elrondProxy.getRouterSmartContract();
        const interaction = contract.methodsExplicit.getAddressesByGroupIdentifier([
            new out_1.BytesValue(Buffer.from(groupId)),
        ]);
        const response = await this.getGenericData(contract, interaction);
        return ((_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf()).map((address) => address.toString());
    }
    async getGroupByOwner(address) {
        var _a;
        const contract = await this.elrondProxy.getRouterSmartContract();
        const interaction = contract.methodsExplicit.getGroupByOwner([
            new out_1.AddressValue(new out_1.Address(address)),
        ]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf().toString();
    }
    async getVestingAddressByGroupIdentifier(groupId) {
        var _a, _b;
        const contract = await this.elrondProxy.getRouterSmartContract();
        const interaction = contract.methodsExplicit.getVestingAddressByGroupIdentifier([
            new out_1.BytesValue(Buffer.from(groupId)),
        ]);
        const response = await this.getGenericData(contract, interaction);
        return (_b = (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf()) === null || _b === void 0 ? void 0 : _b.toString();
    }
    async getLockedAssetTokenId(vestingAddress) {
        var _a, _b;
        const contract = await this.elrondProxy.getVestingSmartContract(vestingAddress);
        const interaction = contract.methods.getLockedAssetTokenId([]);
        const response = await this.getGenericData(contract, interaction);
        return (_b = (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf()) === null || _b === void 0 ? void 0 : _b.toString();
    }
    async getFarmTokenId(childContractAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(childContractAddress);
        const interaction = contract.methods.getFarmTokenIdentifier([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf();
    }
    async getFarmingTokenId(childContractAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(childContractAddress);
        const interaction = contract.methods.getFarmingTokenId([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf();
    }
    async getRewardTokenId(childContractAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(childContractAddress);
        const interaction = contract.methods.getRewardTokenId([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf();
    }
    async areRewardsLocked(childContractAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(childContractAddress);
        const interaction = contract.methods.areRewardsLocked([]);
        const response = await this.getGenericData(contract, interaction);
        return (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf();
    }
    async getVestingScAddress(farmAddress) {
        var _a;
        const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
        const interaction = contract.methods.vestingScAddress([]);
        const response = await this.getGenericData(contract, interaction);
        const firstValue = (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf();
        return firstValue !== null && firstValue !== void 0 ? firstValue : '';
    }
    async getFarmState(address) {
        var _a;
        const contract = await this.elrondProxy.getRouterSmartContract();
        const interaction = contract.methods.getFarmState([address]);
        const response = await this.getGenericData(contract, interaction);
        const firstValue = (_a = response.firstValue) === null || _a === void 0 ? void 0 : _a.valueOf().name;
        return firstValue;
    }
};
AbiStakingService = AbiStakingService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.STAKEGOLD_ELROND_PROXY_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [Object])
], AbiStakingService);
exports.AbiStakingService = AbiStakingService;
//# sourceMappingURL=staking.abi.service.js.map