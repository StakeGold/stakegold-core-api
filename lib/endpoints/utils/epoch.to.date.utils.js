"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcUnlockDateText = exports.calcAlreadyUnlocked = exports.calcIsToday = exports.calcUnlockDate = void 0;
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const calcUnlockDate = ({ epochs, stats }) => {
    if (!stats) {
        return undefined;
    }
    return epochs > 0
        ? epochs === 1
            ? (0, moment_1.default)(stats.nextEpochDate)
            : (0, moment_1.default)(stats.nextEpochDate).add(stats.epochDurationSec * (epochs - 1), 'seconds')
        : (0, moment_1.default)();
};
exports.calcUnlockDate = calcUnlockDate;
const calcIsToday = (unlockDate) => {
    return Boolean(unlockDate === null || unlockDate === void 0 ? void 0 : unlockDate.isSame(new Date(), 'day'));
};
exports.calcIsToday = calcIsToday;
const calcAlreadyUnlocked = (unlockDate) => {
    return Boolean(unlockDate === null || unlockDate === void 0 ? void 0 : unlockDate.isSameOrBefore(new Date()));
};
exports.calcAlreadyUnlocked = calcAlreadyUnlocked;
const calcUnlockDateText = ({ epochs, stats, hasSteps, }) => {
    const unlockDate = (0, exports.calcUnlockDate)({
        stats,
        epochs,
    });
    const isToday = (0, exports.calcIsToday)(unlockDate);
    const alreadyUnlocked = (0, exports.calcAlreadyUnlocked)(unlockDate);
    const unlocksLaterToday = isToday && Boolean(unlockDate === null || unlockDate === void 0 ? void 0 : unlockDate.isAfter(new Date()));
    let unlocksAtText, unlocksAtDate;
    switch (true) {
        case alreadyUnlocked:
            unlocksAtText = '';
            unlocksAtDate = 'Unlockable now';
            break;
        case unlocksLaterToday:
            unlocksAtText = 'Unlockable today';
            unlocksAtDate = unlockDate ? unlockDate.format('hh:mm A') : '...';
            break;
        default:
            unlocksAtText = hasSteps ? 'Starts unlocking' : 'Unlocks on';
            unlocksAtDate = unlockDate ? unlockDate.format('MMM Do YYYY') : '...';
            break;
    }
    return { unlocksAtText, unlocksAtDate };
};
exports.calcUnlockDateText = calcUnlockDateText;
//# sourceMappingURL=epoch.to.date.utils.js.map