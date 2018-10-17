
setTimeout( () => {
  process.hrtime = require('browser-process-hrtime')

// hyperswarm tests go here
const network = require('@hyperswarm/network')
const crypto = require('crypto')
const UTP = require('utp-wasm')
const dgram = require('dgram')

let socket = dgram.createSocket('udp4')
socket.bind(20000)


setTimeout(() => {
  let utp = UTP({ socket })
  utp.address = () => utp.socket.address()

  console.log('address', utp.address())

  const net = network({socket: utp})

  // look for peers listed under this topic
  const topic = crypto.createHash('sha256')
    .update('my-hyperswarm-topic')
    .digest()

  net.join(topic, {
    lookup: true, // find & connect to peers
    announce: true // optional- announce self as a connection target
  })

  net.on('connection', (socket, details) => {
    console.log('new connection!', details)

    // you can now use the socket as a stream, eg:
    process.stdin.pipe(socket).pipe(process.stdout)
  })
}, 1000)

}, 1000)


/* 
var socketId;

// Handle the "onReceive" event.
var onReceive = function(info) {
  if (info.socketId !== socketId)
    return;
  console.log(info.data);
};

var arrayBuffer = new ArrayBuffer(12)
var dataView = new DataView(arrayBuffer)
dataView.setInt32(0, 0x1234ABCD)

// Create the Socket
chrome.sockets.udp.create({}, function(socketInfo) {
  socketId = socketInfo.socketId;
  // Setup event handler and bind socket.
  chrome.sockets.udp.onReceive.addListener(onReceive);
  chrome.sockets.udp.bind(socketId,
    "0.0.0.0", 0, function(result) {
      if (result < 0) {
        console.log("Error binding socket.");
        return;
      }
      chrome.sockets.udp.getInfo(socketId, function(socketInfo) {
        console.log("result:", socketInfo)
        
        chrome.sockets.udp.send(socketId, arrayBuffer,
          '127.0.0.1', socketInfo.localPort, function(sendInfo) {
            console.log("sent " + sendInfo.bytesSent);
        });
      })
  });
});

// Create the Socket
chrome.sockets.udp.create({}, function(socketInfo) {
  // The socket is created, now we can send some data
  var socketId = socketInfo.socketId;
  chrome.sockets.udp.send(socketId, arrayBuffer,
    '127.0.0.1', 1337, function(sendInfo) {
      console.log("sent " + sendInfo.bytesSent);
  });
});

*/