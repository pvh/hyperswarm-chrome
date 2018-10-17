# Testbed for HyperSwarm in a Chrome App

An attempt to get HyperSwarm running inside a Chrome app using utp-wasm.

# Making it Work

1. Both UTP and HyperSwarm/network need to have support for options added.
2. @hyperswarm/network's _bind() function shouldn't call bind on an already-bound socket.
3. It doesn't work.
4. 