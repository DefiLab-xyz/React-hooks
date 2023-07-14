interface TokenData {
  "id": string,
  "symbol": string,
  "name": string,
  "decimals": number,
}

interface PoolToken {
  "id": string,
  "symbol": string,
  "name": string,
  "decimals": number,
  "baseToken"?: boolean, // extract this out
  "currentPrice"?: number // extract this out
}

export interface PoolDayData {
    "date": number,
    "volumeUSD": number,
    "tvlUSD": number,
    "feesUSD": number,
    "liquidity": number,
    "high": number,
    "low": number,
    "volumeToken0": number,
    "volumeToken1": number,
    "close": number,
    "open": number,
    "txCount": number
}

interface TickToken { // this should be replaced in the code to use the data from PoolToken (if it makes sense performance wise)
  "decimals": number,
  "symbol": string
}

interface TickPoolData {
  "tick": number,
  "token0Price": number,
  "token1Price": number,
  "token0": TickToken,
  "token1": TickToken
}

interface PoolTickData {
  "tickIdx": string,
  "pool": TickPoolData,
  "decimal": number,
  "liquidityGross": number,
  "liquidityNet": number,
  "price0": number,
  "price1": number,
  "liquidity": number,
  "tvlAmount0": number,
  "tvlAmount1": number,
  "price0N": number,
  "price1N": number,
  "tickIdx0": number,
  "tickIdx1": number,
  "width": number,
}

export interface PoolDataRaw {
  "id": string,
  "feeTier": number,
  "totalValueLockedUSD": number,
  "totalValueLockedETH": number,
  "token0Price": number, 
  "token1Price": number,
  "token0": PoolToken,
  "token1": PoolToken,
  "poolDayData": PoolDayData[],
  "ticks": PoolTickData[],
}

export interface PoolData extends PoolDataRaw {
  "name": string, //
  "price_base": string,  // find where this is used in the code and change to baseToken.symbol {it holds the name not the price}
  "price_token": string, // find where this is used in the code and change to baseToken.symbol {it holds the name not the price}
  "baseToken"?: number, // extract this out
  "currentPrice"?: number // extract this out
  // "loading": boolean,
  "std": number,
  "mean": number,
  "normStd": number,
}

export interface Protocol {
  id: number, 
  title: string, 
  logo: HTMLImageElement, 
  chain: string
}



