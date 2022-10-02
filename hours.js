
/*
const noti = new Notification()
noti.title = "Yo"
noti.subtitle = "Sub"
noti.body = "This is some test text!"

Timer.schedule(3 * 1000, false, () => {
    noti.schedule()
})

eval("Timer.schedule(3 * 1000, false, () => {noti.schedule()})")
const al = new Alert()
al.title =  "DELIVERY"
al.addAction("3")
al.addAction("2")
al.addAction("1")
log(2)
log(await al.presentAlert())
*/

// have to use file manager to be able to get these values
const Files = FileManager.local()
const trackerFile = Files.joinPath(Files.documentsDirectory(), "tracker.txt")
const today = new Date()
let theDate = [today.getMonth()+1, today.getDate(), today.getFullYear()].join("/")
let data = {
  clockedIn: false,
  onDelivery: false,
  lastDate: "",
  events: {
    /*
    Date: {
      In: 00, Out: 11, times: [], 
      summary: {driving: 1.25, inshop: 7.75, dCash: 1.25 * 6.49, shopCash: 7.75 * 10
      }
      */
  }
}
if (!Files.fileExists(trackerFile)) {
  log("File doesn't exist")
  Files.writeString(trackerFile, JSON.stringify(data))
} else {
  log("File exists")
  let stringData = Files.readString(trackerFile)
  if (data.events) {
    data = JSON.parse(stringData)
    log("Parsed Data:", stringData)
  }
}
if (!(theDate in data.events)) {	
  data.events[theDate] = {
    clockedIn: 0,   
    clockedOut: 0,
    times: {
      In: [],
      Out: []
    },
    summary: {driving: 0, inshop: 0, dCash: 0, shopCash: 0, tips:0, mileage:0}	
  }	
}
if (data.lastDate != theDate) {
  data.clockedIn = false
  data.onDelivery = false
  data.lastDate = theDate
}
let clockedIn = data.clockedIn
let onDelivery = data.onDelivery
let eventsToday = data.events[theDate]



async function displayAlert(path) {
  log("display start")
  let alert = new Alert()
  alert.title = "DELIVERY TRACKER"
  if (clockedIn == false) {
    alert.addAction("clock in")
    alert.addDestructiveAction("quit")
    let choice = await alert.presentAlert()
    if (choice == 0) {
      clockedIn = true
      eventsToday.clockedIn = today.getTime()
      log("clocking in")
    }
  } else {
    if (onDelivery == true) {
      log("on delivery")
      alert.addAction("Text Customer")
      alert.addAction("Get Mileage")
      alert.addAction("Add Tip")
      alert.addAction("Delivery Done")
      alert.addDestructiveAction("quit")
      let choice = await alert.presentAlert()
      if (choice == 0) {
        log("chose text")
        let alert2 = new Alert()
        alert2.title = "Customer Contact"
        alert2.addTextField("Number")
        alert2.addAction("Lobby")
        alert2.addAction("Door")  
        alert2.addAction("Other")
        alert2.addDestructiveAction("quit")
        alert2.presentAlert().then((choice) => {
          if (choice == 0) {
            textPerson(alert2.textFieldValue(0), 1)
          } else if (choice == 1) {
            textPerson(alert2.textFieldValue(0), 2)
          }
          switch (choice) {
            case 0:
            case 1:
              textPerson(alert2.textFieldValue(0), choice+1)
              break;
              
            default:
              textPerson(alert2.textFieldValue(0))
              break;
          }
        })
      } else if (choice == 1) {
        let alert2 = new Alert()
        alert2.title = "Mileage Calculator"
        alert2.addTextField("start")
        alert2.addTextField("end")
        alert2.addAction("Calculate")
        alert2.addDestructiveAction("Cancel")
        let c = await alert2.present()
        if (c == 0) {
          log("chose to calculate")
          let startingLocation = alert2.textFieldValue(0)
          
          // const location = await Location.current()
          // let locString = location.latitude + "," + location.longitude
          let locString = "28.679780287162394,-81.40927122166839"
          let tf1 = alert2.textFieldValue(1)
          let address = encodeURI(tf1)
          let mapsLink = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${address}&origins=${locString}&units=imperial&key=AIzaSyByHczbqkvNiLPUVuqFLE26j3DMehPZqeg`
          log(mapsLink)
          let req = new Request(mapsLink)
          let reqJSON = await req.loadJSON()
          let dist = reqJSON.rows[0].elements[0].distance.value/1609
          if (dist) {
            eventsToday.summary.mileage += dist * .5
          }
        }
      } else if (choice == 2) {
        log("chose tip")
        let alert2 = new Alert()
        alert2.title = "TIP"
        alert2.addTextField("amount")
        alert2.addAction("submit")
        alert2.addDestructiveAction("cancel")
        let c = await alert2.present()
        if (c == 0) {
          let txtfield = alert2.textFieldValue(0)
          log("tip amt: " + txtfield)
          eventsToday.summary.tips += parseFloat(txtfield)
        }
      } else if (choice == 3) {
        // stopping delivery
        onDelivery = false
        eventsToday.times.In.push(today.getTime())
        log("stopping delivery")
      }
    } else {
      // clocked in, not on delivery
      alert.addAction("start delivery")
      alert.addAction("clock out")
      alert.addDestructiveAction("quit")
      log("choice")
      let choice = await alert.presentAlert()
      if (choice == 0) {
        log("starting delivery")
        onDelivery = true
        log("done starting delivery")
        eventsToday.times.Out.push(today.getTime())
        log("appended")
      } else if (choice == 1) {
        log("clocking out")
        clockedIn = false
        onDelivery = false
        eventsToday.clockedOut = today.getTime()
        /*for (let i = 0; i < eventsToday.Out.length-2; i++) {
          let timeInShop = ((i == 0) ? eventsToday.clockedIn : eventsToday.In[i]) - eventsToday.Out[i+1]
          let timeDelivering = eventsToday.Out[i] - eventsToday.In[i]
          eventsToday.summary.driving += (timeDelivering / 3600000)
          eventsToday.summary.inshop += timeInShop / 3600000
          log(timeInShop)
          log(timeDelivering)
        }*/
        eventsToday.summary.dCash = eventsToday.summary.driving * 6.49
        eventsToday.summary.shopCash = eventsToday.summary.inshop * 10
      }
    }
  }
  log("display done")
}
function textPerson(number, selection) {
  if (number && selection) {
    const msg = new Message()
    if (selection == 1) {
      msg.body = "Hello this is your Jimmy Johns Delivery Driver. I've left your food in the lobby. Enjoy and have a good day!"
    } else if (selection == 2) {
      msg.body = "Hello this is your Jimmy Johns Delivery Driver. I've left your food at the front door. Enjoy and have a good day!"
    } else {
      msg.body = "Hello this is your Jimmy Johns Driver."
    }
    msg.recipients = [number.toString()]
    msg.send()
  }
}
function makeNotification(args) {
  
}
// textPerson(3219992453, 1)
log("before display")
await displayAlert()
log("after display")

data.clockedIn = clockedIn
data.onDelivery = onDelivery
console.log("ci: " + clockedIn + " del: " + onDelivery)
log(data)
Files.writeString(trackerFile, JSON.stringify(data))
log("eof")