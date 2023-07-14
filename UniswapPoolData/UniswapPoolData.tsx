import React, { useState, useEffect } from 'react'
import { PoolData, PoolDataRaw, PoolDayData } from "./UniswapPoolData.type"
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
    normStd: stats.normStd
  };
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