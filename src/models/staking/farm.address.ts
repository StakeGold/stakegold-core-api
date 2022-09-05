export class FarmAddress {
    unlockedRewardsAddress: string = '';
    lockedRewardsAddress: string = '';

    constructor (init?: Partial<FarmAddress>) {
        Object.assign(this, init);
    }
}
