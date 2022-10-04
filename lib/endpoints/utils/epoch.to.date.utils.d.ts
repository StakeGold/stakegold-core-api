import moment from 'moment';
export declare const calcUnlockDate: ({ epochs, stats }: {
    epochs: number;
    stats: any;
}) => moment.Moment | undefined;
export declare const calcIsToday: (unlockDate?: moment.Moment) => boolean;
export declare const calcAlreadyUnlocked: (unlockDate?: moment.Moment) => boolean;
export declare const calcUnlockDateText: ({ epochs, stats, hasSteps, }: {
    epochs: number;
    stats: any;
    hasSteps: boolean;
}) => {
    unlocksAtText: string;
    unlocksAtDate: string;
};
