import { useEffect, useState } from 'react';

export const useRealTimeETHPrice = () => {
  const [ethPrice, setEthPrice] = useState(<any>0);

  useEffect(() => {
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@trade');
    socket.onmessage = (event) => {
      const tradeData = JSON.parse(event.data);
      const newEthPrice = parseFloat(tradeData.p);
      if(newEthPrice)
        setEthPrice(newEthPrice);
    };

    socket.onclose = () => {
      console.error('WebSocket connection closed.');
    };

    return () => {
      socket.close();
    };
  }, []);

  return ethPrice;
};
