
// Something in the stack is relying on process.hrtime, which browsers lack
// and the browserify default process object does not include.
process.hrtime = require('browser-process-hrtime')

const network = require('@hyperswarm/network')
const crypto = require('crypto')

// chrome-dgram is not compatible with node dgram in a few ways,
// usually because chrome-dgram does almost everything asynchronously
const dgram = require('chrome-dgram')

// we pass a chrome-dgram socket to UTP-wasm which we pass to network()
// it's the turducken of networking.
const UTP = require('utp-wasm')

let socket = dgram.createSocket('udp4')
socket.bind(20000)

// we give the socket.bind() a second to complete :(
setTimeout(() => {
  // this won't work for you until you fix the export UTP line (i sent a PR) 
  let utp = UTP({ socket })
  // there's a PR for this too
  utp.address = () => utp.socket.address()

  // this had better show a port or you'll have more problems soon
  console.log('address', utp.address())

  // i had to implement options passing here, i'm sure you can see how
  const net = network({socket: utp, ephemeral: false})

  // look for peers listed under this topic
  const topic = crypto.createHash('sha256')
    .update('my-hyperswarm-topic')
    .digest()

  // this errors with Socket is already bound unless you disable 
  // the extra listen(0) somehow
  net.join(topic, {
    lookup: true, // find & connect to peers
    announce: true // optional- announce self as a connection target
  })

  net.on('connection', (socket, details) => {
    console.log('new connection!', details)

    // you can now use the socket as a stream, eg:
    // (this doesn't work in a chrome app but since we don't have connections
    //  i have not yet bothered to put something else in)
    process.stdin.pipe(socket).pipe(process.stdout)
  })

}, 1000)
