import { Assets } from "../account";
export interface NftCollection {
    collection: string;
    name: string;
    ticker: string;
    decimals: number;
    issuer: string;
    timestamp: number;
    canUpgrade?: boolean;
    canMint?: boolean;
    canBurn?: boolean;
    canChangeOwner?: boolean;
    canPause?: boolean;
    canFreeze?: boolean;
    canWipe?: boolean;
    canAddSpecialRoles?: boolean;
    canTransferNFTCreateRole?: boolean;
    NFTCreateStopped?: boolean;
    assets?: Assets;
    balance?: string;
}
