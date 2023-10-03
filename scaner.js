const net = require('net');

function generisiNiz(doBroja) {
    var niz = [];
    for (var i = 1; i <= doBroja; i++) {
        niz.push(i);
    }
    return niz;
}
/*
const suspiciousPorts = [31337, 12345, 22, 23, 25, 53, 445, 6666, 1433, 3389, 5900, 6660, 6661, 6662, 6663, 6664, 6665 ,6666, 6667, 6668, 6669]; // Primer sumnjivih portova
*/
const suspiciousPorts = generisiNiz(65000);

function scanPort(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(1000); // Postavljamo timeout za pokušaj povezivanja

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

async function scanSuspiciousPorts(host) {
  const suspiciousOpenPorts = [];

  for (const port of suspiciousPorts) {
    const isOpen = await scanPort(host, port);
    if (isOpen) {
      suspiciousOpenPorts.push(port);
    }
  }

  return suspiciousOpenPorts;
}

const targetHost = '127.0.0.1'; // Vaša lokalna IP adresa

scanSuspiciousPorts(targetHost)
  .then((suspiciousOpenPorts) => {
    if (suspiciousOpenPorts.length === 0) {
      console.log('Nema otvorenih sumnjivih portova.');
    } else {
      console.log('Otvoreni sumnjivi portovi:', suspiciousOpenPorts.join(', '));
    }
  })
  .catch((err) => {
    console.error('Greška prilikom skeniranja:', err);
  });
