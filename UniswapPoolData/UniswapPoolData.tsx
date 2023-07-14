import React, { useState, useEffect } from 'react'
import { PoolData, PoolDataRaw, PoolDayData, PoolTickData, PoolLiquidityData } from "./UniswapPoolData.type"
import { fetchPoolDataById } from './queries/pools'
import { stdSample } from '../helpers/std'
import { sumArray } from '../helpers/numbers'

interface DailyStats {
  std: number,
  mean: number,
  normStd: number
}

const genDailyStats = ( dailyPoolData: PoolDayData[] ): DailyStats => {

  if ( !dailyPoolData.length || dailyPoolData.length <= 10 ) return { std: NaN, mean: NaN, normStd: NaN };

  const closePrices:number[] = Array.from(dailyPoolData, d => d.close);
  const std:number = stdSample(closePrices);
  const mean:number = sumArray(closePrices) / closePrices.length;

  return { std: std, mean: mean, normStd: (std / mean) * 100 };
}

const processPoolData = ( poolData: PoolDataRaw ): PoolData =>{

  const stats:DailyStats = genDailyStats(poolData.poolDayData);

  return {
    ...poolData,
    name: poolData.token1.symbol + " / " + poolData.token0.symbol,
    price_base: '',
    price_token: '',
    baseToken: 0,
    currentPrice: 0,
    std: stats.std,
    mean: stats.mean,
    normStd: stats.normStd,
    liquidity: genLiquidityData(poolData.ticks, poolData.feeTier)
  };
}

const genLiquidityData = ( data:PoolTickData[], feeTier:number ): PoolLiquidityData[] => {

  const calcTvl = ( liquidity:number, feeTier:number, price:number, decimals:number[] ): number[] => {

    const multiplier = 1 + (feeTier / 500000);
    const T = liquidity * Math.sqrt(price);
    const H = liquidity / Math.sqrt(price * multiplier);

    const amount0 = ((Math.pow(liquidity, 2) / T) - H)  / Math.pow(10, decimals[1]);
    const amount1 = ((Math.pow(liquidity, 2 ) / H) - T) / Math.pow(10, decimals[0]);

    return [amount0, amount1];

  }

  let cumsum:number = 0;
  const multiplier:number = 1 + (feeTier / 500000);
  const len:number = data.length;

  return data.map((d, i) => {

    cumsum += d.liquidityNet;
    const T:number = cumsum * Math.sqrt(d.price0);
    const H:number = cumsum / Math.sqrt(d.price0 * multiplier);
    const nextRecord:number = Math.min((len - 1), (i + 1));
    const width:number = Math.abs(data[nextRecord].tickIdx)  - d.tickIdx;

    return {
      ...d, 
      decimal: d.pool.token0.decimals - d.pool.token1.decimals,
      liquidity: cumsum,
      width: width,
      tvlAmount0: ((Math.pow(cumsum, 2) / T) - H) / Math.pow(10, d.pool.token0.decimals),
      tvlAmount1: ((Math.pow(cumsum, 2 ) / H) - T) / Math.pow(10, d.pool.token1.decimals),
      price0: d.price0,
      price1: d.price1,
      price0N: Math.pow(1.0001, d.tickIdx) / Math.pow(10, (d.pool.token1.decimals - d.pool.token0.decimals)),
      price1N: Math.pow(1.0001, d.tickIdx * -1) / Math.pow(10, (d.pool.token0.decimals - d.pool.token1.decimals)),
      tickIdx0: d.tickIdx,
      tickIdx1: (d.tickIdx * -1) - width
    }
  });
  
}

const emptyDataSetError = (id: string, protocol:number) => {
  return { error: `Empty dataset returned for id: ${id} & protocol: ${protocol}`, code: 0 }
}

export default function useUniswapPoolData( ) {
  
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<{ error: string, code?: number } | '' >('');
  const [ poolData, setPoolData ] = useState<PoolData | {}>({});
  const [ poolDataRaw, setPoolDataRaw ] = useState<PoolDataRaw | {} >({});

  const fetchPoolData = ( id: string, protocol: number, signal?: AbortSignal ): void => {

    setLoading(true);
    setPoolData({});

    fetchPoolDataById( id, protocol, signal ).then( d => {
      if ( d.hasOwnProperty("error") ) {
        setError(error);
      }
      if ( d === null ) {
        setError(emptyDataSetError(id, protocol));
      }
      if ( d && d.hasOwnProperty("id")) {
        setPoolDataRaw(d.id[0]);   
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    if (poolDataRaw && ('id' in poolDataRaw)) {
      setPoolData( processPoolData(poolDataRaw) )
    }
  }, [poolDataRaw])

  return { loading, error, poolData, fetchPoolData };

}