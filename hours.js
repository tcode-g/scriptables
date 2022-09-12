


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
  if (data.events)
  data = JSON.parse(stringData)
  log("Parsed Data:", data)
}
if (!(theDate in data.events)) {	
  data.events[theDate] = {
    clockedIn: 0,
    clockedOut: 0,
    times: {
      In: [],
      Out: []
    },
    summary: {driving: 0, inshop: 0, dCash: 0, shopCash: 0, tips:0}	
  }	
}
let clockedIn = data.clockedIn
let onDelivery = data.onDelivery
let eventsToday = data.events[theDate]



function displayAlert(path) {
  let alert = new Alert()
  alert.title = "DELIVERY TRACKER"
  if (clockedIn == false) {
    alert.addAction("clock in")
    alert.addDestructiveAction("quit")
    alert.presentAlert().then((choice) => {
      if (choice == 0) {
        clockedIn = true
        data.events[theDate].clockedIn = today.getTime()
      }
    })
  } else {
    if (onDelivery == true) {
      alert.addAction("Text Customer")
      alert.addAction("Add Tip")
      alert.addAction("Delivery Done")
      alert.addDestructiveAction("quit")
      alert.presentAlert().then((choice) => {
        if (choice == 0) {
          let alert2 = new Alert()
          alert2.title = "Customer Contact"
          alert2.addTextField("Number", "Phone")
          alert2.addAction("Lobby")
          alert2.addAction("Front Door")  
          alert2.addAction("Other")
          alert2.addDestructiveAction("quit")
          alert2.presentAlert().then((choice) => {
            if (choice == 0) {
              textCustomer(alert2.textFieldValue(0), 1)
            } else if (choice == 1) {
              textCustomer(alert2.textFieldValue(0), 2)
            }
            switch (choice) {
              case 0:
              case 1:
                textCustomer(alert2.textFieldValue(0), choice+1)
                break;
                
              default:
                textCustomer(alert2.textFieldValue(0))
                break;
            }
          })
        } else if (choice == 1) {
          // stopping delivery
          onDelivery = false
          data.events[theDate].times.In.append(today.getTime())
        }
      })
    } else {
      // clocked in, not on delivery
      alert.addAction("start delivery")
      alert.addAction("clock out")
      alert.addDestructiveAction("quit")
      alert.presentAlert().then((choice) => {
        if (choice == 0) {
          onDelivery = true
          eventsToday.times.Out.append(today.getTime())
        } else if (choice == 1) {
          clockedIn = false
          onDelivery = false
          eventsToday.clockedOut = today.getTime()
          for (let i = 0; i < data.events[theDate].Out.length-2; i++) {
            let timeInShop = ((i == 0) ? data.events[theDate].clockedIn : data.events[theDate].In[i]) - data.events[theDate].Out[i+1]
            let timeDelivering = data.events[theDate].Out[i] - data.events[theDate].In[i]
            eventsToday.summary.driving += (timeDelivering / 3600000)
            eventsToday.summary.inshop += timeInShop / 3600000
            log(timeInShop, timeDelivering)
          }
          eventsToday.summary.dCash = data.events[theDate].summary.driving * 6.49
          eventsToday.summary.shopCash = data.events[theDate].summary.inshop * 10
        }
      })
    }
  }
}
function textCustomer(number, selection) {
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
// textCustomer(3219992453, 1)
displayAlert()

data.clockedIn = clockedIn
data.onDelivery = onDelivery
log(data)
Files.writeString(trackerFile, JSON.stringify(data))