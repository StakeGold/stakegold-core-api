import {
  BinaryCodec,
  BooleanType,
  FieldDefinition,
  ListType,
  StructType,
  U64Type,
} from '@elrondnetwork/erdjs/out';

export type UnlockMilestoneType = {
  epoch: number | undefined;
  percent: number | undefined;
};

export type LockedAssetAttributesType = {
  unlockSchedule: UnlockMilestoneType[] | undefined;
  isMerged: boolean | undefined;
};

export interface UnlockMilestone {
  epoch: number;
  percent: number;
  unlockDate?: string;
}

export class LockedAssetAttributes {
  unlockSchedule: UnlockMilestone[] | undefined;
  isMerged: boolean | undefined;

  constructor(init?: Partial<LockedAssetAttributes>) {
    Object.assign(this, init);
  }

  static fromDecodedAttributes(decodedAttributes: any): LockedAssetAttributes {
    const unlockSchedule = decodedAttributes.UnlockSchedule.valueOf().map((value: any) => {
      const epoch = value.unlock_epoch?.toNumber();
      const percent = value.unlock_percent?.toNumber();
      return {
        epoch,
        percent,
      } as UnlockMilestone;
    });

    return new LockedAssetAttributes({
      unlockSchedule,
      isMerged: decodedAttributes.isMerged,
    });
  }

  static fromAttributes(attributes: string): LockedAssetAttributes {
    const attributesBuffer = Buffer.from(attributes, 'base64');
    const codec = new BinaryCodec();

    const structType = LockedAssetAttributes.getStructure();
    const [decodedRaw] = codec.decodeNested(attributesBuffer, structType);

    const decoded = decodedRaw.valueOf();
    const response = LockedAssetAttributes.fromDecodedAttributes(decoded);
    return response;
  }

  static getStructure(): StructType {
    return new StructType('LockedAssetAttributes', [
      new FieldDefinition(
        'UnlockSchedule',
        '',
        new ListType(
          new StructType('UnlockMilestone', [
            new FieldDefinition('unlock_epoch', '', new U64Type()),
            new FieldDefinition('unlock_percent', '', new U64Type()),
          ]),
        ),
      ),
      new FieldDefinition('isMerged', '', new BooleanType()),
    ]);
  }
}
