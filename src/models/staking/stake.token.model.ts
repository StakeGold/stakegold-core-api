export class StakeTokenModel {
    identifier: string = '';
    name: string = '';
    decimals: number = 0;
    icon: string = '';
    balance?: string = '';
    collection: string = '';

    constructor(init?: Partial<StakeTokenModel>) {
        Object.assign(this, init);
    }
}
