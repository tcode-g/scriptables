


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
      compiled: {driving: 1.25, inshop: 7.75, dCash: 1.25 * 6.49, shopCash: 7.75 * 10
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
    In: 0,	
    Out: 0,	
    times: [],	
    compiled: {driving: 0, inshop: 0, dCash: 0, shopCash: 0}	
  }	
}
let clockedIn = data.clockedIn
let onDelivery = data.onDelivery



function displayAlert(path) {
  let alert = new Alert()
  alert.title = "DELIVERY TRACKER"
  if (clockedIn == false) {
    alert.addAction("clock in")
    alert.addDestructiveAction("quit")
    alert.presentAlert().then((choice) => {
      if (choice == 0) {
        clockedIn = true
        data.events[theDate].In = today.getTime()
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
            switch (chioce) {
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
          onDelivery = false
          data.events[theDate].times = true
        }
      })
    } else {
      
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

Files.writeString(trackerFile, JSON.stringify(data))