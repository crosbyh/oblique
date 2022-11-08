// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: brain;
let items = await loadItems()
if (config.runsInWidget) {
  let widget = await createWidget(items)
  Script.setWidget(widget)
} else if (config.runsWithSiri) {
  let firstItems = items.slice(0, 5)
  let table = createTable(firstItems)
  await QuickLook.present(table)
} else {
  let table = createTable(items)
  await QuickLook.present(table)
}
Script.complete()

async function createWidget(items) {
  // Get random wisdom entry
  let item = items[Math.floor(Math.random()*items.length)]
  
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  let gradientOptions = [
    [new Color("#000000"), new Color("#434343")]
  ]
  let targetGradient = gradientOptions[Math.floor(Math.random()*gradientOptions.length)]
  gradient.colors = targetGradient
  let widget = new ListWidget()
  widget.backgroundColor = targetGradient[1]
  widget.backgroundGradient = gradient

  // Add spacer above content to center it vertically.
  widget.addSpacer()
  
  let title = cleanString(item)
  let titleElement = widget.addText(title)
  titleElement.font = Font.boldSystemFont(16)
  titleElement.textColor = Color.white()
  titleElement.minimumScaleFactor = 0.5

  // Add spacing below content to center it vertically.
  widget.addSpacer()
  return widget
}

function createTable(items) {
  let table = new UITable()
  for (item of items) {
    let row = new UITableRow()
    let title = cleanString(item)
    let titleCell = row.addText(title)
    titleCell.minimumScaleFactor = 0.5
    titleCell.widthWeight = 60
    row.height = 60
    row.cellSpacing = 10
    row.onSelect = (idx) => {
      let item = items[idx]
      let alert = new Alert()
      alert.message = cleanString(item)
      alert.presentAlert()
    }
    row.dismissOnSelect = false
    table.addRow(row)
  }
  return table
}
  
async function loadItems() {
  let url = "https://raw.githubusercontent.com/crosbyh/oblique/main/oblique.md"
  let req = new Request(url)
  let rawBody = await req.loadString()
  let wisdomComponents = rawBody.split("# Oblique Strategies")[1]
  wisdomComponents = wisdomComponents.split("----\n\n[**")[0]
  let bodyComponents = wisdomComponents.split("\n-")
  bodyComponents.splice(0, 1)
  return bodyComponents
}

function cleanString(str) {
  let cleanedString = str.replace("Related: ", "")
  cleanedString = cleanedString.split("\n\n")[0]
  cleanedString = cleanedString.split("\n* *")[0]
  cleanedString = cleanedString.split("\n##")[0]
  cleanedString = cleanedString.trim()
  let regex = /&#(\d+);/g
  return cleanedString.replace(regex, (match, dec) => {
    return String.fromCharCode(dec)
  })
}
