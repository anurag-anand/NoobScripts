const network = require('network');
const excel = require('exceljs');
const { TaskTimer } = require('tasktimer');
const player = require('play-sound')((opts = {}));
const ping = require('ping');

const workbook1 = new excel.Workbook();
workbook1.creator = 'Me';
workbook1.lastModifiedBy = 'Me';
workbook1.created = new Date();
workbook1.modified = new Date();
const sheet1 = workbook1.addWorksheet('Sheet1');
const reColumns = [
  { header: 'Time', key: 'time' },
  { header: 'public Ip', key: 'pip' },

  { header: 'Gateway IP ', key: 'gip' },
  { header: 'Gateway Ip Alive ', key: 'isGip' },
  { header: 'is 8.8.8.8 Alive ', key: 'isGDNS' },
  { header: 'internal Ip', key: 'inter' },
  { header: 'timestamp', key: 'tsp' },

];
sheet1.columns = reColumns;

let data = []

let noNet = false

const pingGivenostArray = (hosts = ['8.8.8.8']) => {
  return new Promise((resolve, reject) => {
    const hosts1 = [...hosts, '8.8.8.8']

    Promise.all(hosts1.map(x => ping.promise.probe(x, {
      timeout: 5,
      extra: ['-i', '2'],
    }))

    )
      .then(ressss => {
        resolve(ressss.map(y => ({ host: y.host, alive: y.alive ? 'Yes' : 'No' })))

        // console.log(ressss, "ALLL PROMISED RESOLVED")
      })
      .catch(err => {

        reject(err)
        console.log(errrr, "ERROR RESOLVING ALL PROMISES")


      })

  });
}



const callBackToPromiseCurried = (funcInp) => (command) => {

  return new Promise((resolve, reject) => {
    funcInp(command, (err, output) => {
      if (!err) {
        resolve(output)
      } else {
        reject(err)
      }
    })
  })
}

const saveTOexcelExistingData = () => {

  return new Promise((resolve, reject) => {
    data.forEach(e => {
      let thisrow = sheet1.addRow({ ...e, tsp: Date.now() })

      if (e.pip == "N/A" || e.inter != "192.168.1.3") {
        thisrow.fill = {
          type: 'pattern',
          pattern: 'darkVertical',
          fgColor: {
            argb: 'FFFF0000'
          }
        }
      }
    })
    workbook1.xlsx
      .writeFile(`./UpTime${Date.now()}.xlsx`)
      .then(function () {
        console.log('xlsx file is written.');
        resolve(1)
      }).catch(err => reject(err))
  })


}
// const promiseReturningGetActiveInterface = callBackToPromiseCurried(network.get_active_interface)
// const promiseReturningGetPublicIp = callBackToPromiseCurried(network.get_public_ip)

const getPubLicIpAndInterfacePromise = () => {
  return new Promise((resolve, reject) => {
    let activeInter = {}
    // promiseReturningGetActiveInterface()
    //   .then(activeInterfaces => {
    //     activeInter = { pip: "N/A", inter: activeInterfaces.ip_address, time: new Date().toLocaleString(), gip: activeInterfaces.gateway_ip }
    //     return promiseReturningGetPublicIp()
    //   }).then(
    //     publicIp => {
    //       activeInter = { ...activeInter, pip: publicIp }

    //       return pingGivenostArray([activeInter.gip])
    //     }

    //   )
    //   .then(resolvedHostPings => {

    //     activeInter = { ...activeInter, isGip: resolvedHostPings.find(x => x.host == activeInter.gip).alive, isGDNS: resolvedHostPings.find(x => x.host == '8.8.8.8').alive }
    //     console.log(activeInter)
    //     resolve(activeInter)
    //   }).

    //   catch(err => {
    //     // console.log(err.msg || "TTTT")
    //     const temp2 = { pip: "N/A", inter: "N/A", time: new Date().toLocaleString() }
    //     console.log(temp2)
    //     resolve(temp2)
    //   })


    network.get_active_interface(function (err, obj) {

      // console.log("Active interfaces", err || JSON.stringify(obj))

      if (err) {
        const temp2 = { pip: "N/A", inter: "N/A", time: new Date().toLocaleString() }
        console.log(temp2)
        resolve(temp2)

      } else {
        activeInter = { pip: "N/A", inter: obj.ip_address, time: new Date().toLocaleString(), gip: obj.gateway_ip }
        network.get_public_ip((err1, ip) => {
          if (err1) {
            // player.play("beep.mp3")
            pingGivenostArray([activeInter.gip])
              .then(resolvedHostPings => {

                activeInter = { ...activeInter, isGip: resolvedHostPings.find(x => x.host == activeInter.gip).alive, isGDNS: resolvedHostPings.find(x => x.host == '8.8.8.8').alive }
                console.log(activeInter, "NOOOO IP ")
                resolve(activeInter)
              })
              .catch(errrr1 => {
                activeInter = { ...activeInter, isGip: "N/A", isGDNS: "N/A" }
                console.log(errrr1, "Final Error")
                resolve(activeInter)
              })

          } else {
            pingGivenostArray([activeInter.gip])
              .then(resolvedHostPings => {

                activeInter = { ...activeInter, pip: ip, isGip: resolvedHostPings.find(x => x.host == activeInter.gip).alive, isGDNS: resolvedHostPings.find(x => x.host == '8.8.8.8').alive }
                console.log(activeInter, "TTTTTTTTTTTTTTTtt")

                resolve(activeInter)
              })
              .catch(errrr1 => {
                activeInter = { ...activeInter, isGip: "N/A", isGDNS: "N/A" }
                console.log(errrr1, "Final errorr")
                resolve(activeInter)
              })
          }

        })

        // promiseReturningGetPublicIp()
        //   .then(
        //     publicIp => {
        //       activeInter = { ...activeInter, pip: publicIp }

        //       return pingGivenostArray([activeInter.gip])
        //     }

        //   )
        //   .then(resolvedHostPings => {

        //     activeInter = { ...activeInter, isGip: resolvedHostPings.find(x => x.host == activeInter.gip).alive, isGDNS: resolvedHostPings.find(x => x.host == '8.8.8.8').alive }
        //     console.log(activeInter)
        //     resolve(activeInter)
        //   }).

        //   catch(err => {
        //     console.log(err.msg || "TTTT")
        //     console.log(err)
        //     const temp2 = { pip: "N/A", inter: "N/A", time: new Date().toLocaleString() }
        //     console.log(temp2)
        //     resolve(temp2)
        //   })
        // network.get_public_ip((err1, ip) => {
        //   if (err1) {
        //     const temp1 = { pip: "N/A", inter: obj.ip_address, time: new Date().toLocaleString(), gip: obj.gateway_ip }
        //     console.log(temp1)
        //     resolve(temp1)

        //   } else {


        //     const temp = { pip: ip, inter: obj.ip_address, time: new Date().toLocaleString(), gip: obj.gateway_ip }
        //     console.log(temp)
        //     resolve(temp)

        //   }
        // })

      }

    })
  })

}
const timer = new TaskTimer(1000);

timer.add([
  {
    id: "task-1",
    tickInterval: 10,
    totalRuns: 0,
    callback(task) {
      getPubLicIpAndInterfacePromise()
        .then(resolvedVal => {
          data.push(resolvedVal)
        }).catch(err => {
          console.log(err, "at time", new Date().toLocaleString())
        })
    },
    tickDelay: 1
  }, {
    id: "task-2",
    tickInterval: 30 * 60,
    totalRuns: 0,
    callback(task) {
      saveTOexcelExistingData()
        .then(resolvedVal => {
          console.log("saved into excel at time ", new Date().toLocaleString())

        }).catch(err => {
          console.log(err, "at time", new Date().toLocaleString())
        })
    },
    tickDelay: 1
  }
])

timer.on('tick', () => {
  console.log('tick count: ' + timer.tickCount);
  console.log('elapsed time: ' + timer.time.elapsed + ' ms.');
  // stop timer (and all tasks) after 1 hour

});
network.get_interfaces_list(function (err, list) {

  console.log(err || list)
  /* list should be:
 
  [{
    name: 'eth0',
    ip_address: '10.0.1.3',
    mac_address: '56:e5:f9:e4:38:1d',
    type: 'Wired',
    netmask: '255.255.255.0',
    gateway_ip: '10.0.1.1' 
   },
   { ... }, { ... }]
 
  */
})
timer.start();

