Sure! Here's a sample README for your custom React hook `useUniswapPoolData`:

# useUniswapPoolData

`useUniswapPoolData` is a custom React hook that provides functionality to fetch and process data related to Uniswap pools. It handles fetching pool data by ID and protocol, and returns loading status, error information, and processed pool data.

## Usage

Here's an example of how you can use `useUniswapPoolData` in your React components:

```jsx
import React from 'react';
import useUniswapPoolData from './useUniswapPoolData';

function MyComponent() {
  const { loading, error, poolData, fetchPoolData } = useUniswapPoolData();

  // Call fetchPoolData to load pool data
  React.useEffect(() => {
    const id = 'your-pool-id';
    const protocol = 1; // 0 = Ethereum, 1 = Optimism, 2 = Arbitrum, 3 = Polygon, 4 = Perpetual Optimism, 5 = Celo
    const abortController = new AbortController();
    fetchPoolData(id, protocol, abortController.signal);
    
    // Clean up the abort controller on unmount
    return () => abortController.abort();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.error}</div>;
  }

  // Render pool data
  return (
    <div>
      <h2>{poolData.name}</h2>
      <p>Standard Deviation: {poolData.std}</p>
      <p>Mean: {poolData.mean}</p>
      {/* Render other pool data as needed */}
    </div>
  );
}

export default MyComponent;
```

In the example above, useUniswapPoolData is called to initialize the hook. The fetchPoolData function is used to fetch the pool data based on the provided ID and protocol. The protocol parameter accepts the following values:

0: Ethereum (default)
1: Optimism
2: Arbitrum
3: Polygon
4: Perpetual Optimism
5: Celo

You can pass the corresponding number to the protocol parameter to fetch data for the desired protocol.

Make sure to replace `'your-pool-id'` with the actual pool ID you want to fetch.

## Customization

You can customize the `useUniswapPoolData` hook to fit your specific requirements. For example, you can modify the `fetchPoolData` function to use a different API endpoint or add additional processing logic in the `processPoolData` function.

## License

This project is licensed under the [MIT License](LICENSE).

Feel free to modify and adapt the hook according to your needs.

Please let me know if there's anything else I can help you with!