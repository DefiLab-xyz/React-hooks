import { PoolDataRaw } from "../UniswapPoolData.type";
import { urlForProtocol, requestBody } from "./helpers";

const pppl = `poolDayData (first:90, orderBy:date, orderDirection:desc ) {
  date
  volumeUSD
  tvlUSD
  feesUSD
  liquidity
  high
  low
  volumeToken0
  volumeToken1
  close
  open
  txCount
}`

const poolQueryFields: string = `{
  id
  feeTier
  totalValueLockedUSD
  totalValueLockedETH
  token0Price
  token1Price  
  token0 {
    id
    symbol
    name
    decimals
  }
  token1 {
    id
    symbol
    name
    decimals
  }
  poolDayData (first:90, orderBy:date, orderDirection:desc ) {
    date
    volumeUSD
    tvlUSD
    feesUSD
    liquidity
    high
    low
    volumeToken0
    volumeToken1
    close
    open
    txCount
  }
  ticks (first: 1000, orderBy: tickIdx) {
    liquidityGross
    liquidityNet
    price0
    price1
    tickIdx
    pool {
      tick
      token0Price
      token1Price
      token0 {
        decimals
        symbol
      }
      token1 {
        decimals
        symbol
      }
    }
  }
}`

export const fetchPoolDataById = async ( id: string,  protocol: number, signal?: AbortSignal ) => {

  const url = urlForProtocol(protocol);

  const query =  `query Pools( $id: ID! ) { id: pools( where: { id: $id } 
    orderBy:totalValueLockedETH, orderDirection:desc) 
    ${poolQueryFields}
  }`

  try { 

    const response = await fetch( url, requestBody({ query: query, variables: { id: id }, signal: signal }));
    const data = await response.json();
    return data && data.data ? data.data : null;

  } catch ( error ) {

    return { error: error };

  }


}