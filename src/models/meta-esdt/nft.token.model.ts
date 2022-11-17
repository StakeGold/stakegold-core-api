export interface NFTToken {
  identifier: string;
  collection: string;
  ticker: string;
  decimals: number;
  timestamp?: number;
  attributes: string;
  nonce: number;
  type: string;
  name: string;
  creator: string;
  royalties?: number;
  uris?: string[];
  url?: string;
  tags?: string[];
  balance: string;
  media?: NftTokenMedia;
}

export interface NftTokenMedia {
  url?: string;
  originalUrl?: string;
  thumbnailUrl?: string;
  fileType?: string;
}
