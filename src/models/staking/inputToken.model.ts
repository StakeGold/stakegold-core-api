export class InputTokenModel {
    identifier: string = '';
    nonce: number = 0;
    amount: string = '0';
    attributes?: string;
    collection :string = '';

    constructor(init?: Partial<InputTokenModel>) {
        Object.assign(this, init);
    }
}
