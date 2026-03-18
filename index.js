import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { identify } from '@libp2p/identify'
import { circuitRelayServer } from '@libp2p/circuit-relay-v2'

async function main() {
  const port = process.env.PORT || 10000;
  
  const node = await createLibp2p({
    addresses: {
      listen: [`/ip4/0.0.0.0/tcp/${port}/ws`]
    },
    transports: [webSockets()],
    connectionEncryption: [noise()],
    streamMuxers: [yamux()],
    services: {
      identify: identify(),
      relay: circuitRelayServer({
        reservations: {
          maxReservations: Infinity,
          applyDefaultLimit: false
        }
      })
    }
  });

  console.log(`Relay server WS listening on port ${port}...`);
  node.getMultiaddrs().forEach((ma) => console.log(ma.toString()));
}

main();
