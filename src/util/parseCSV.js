const Papa = require('papaparse')
const fs = require('fs')

fs.access(process.argv[2], fs.F_OK, err => {
  if (err) {
    console.error(err)
    return
  }
  parse(fs.readFileSync(process.argv[2], 'utf8'))
})

let mutAllData = {
  header: [],
  data: {},
  meta: {}
}

function parse(file) {
  let groupName

  Papa.parse(file, {
    worker: true,
    step: ({ data }) => {
      if (mutAllData.header.length === 0) {
        mutAllData.header = data.map(d => d.trim())
        // setProductDoc({ _id: 'header', data: data })
        // setDoSave(true)
      } else if (
        data[0] &&
        data[0] !== '' &&
        data.slice(1, data.length).filter(x => x.trim() !== '').length === 0
      ) {
        if (!groupName) {
          groupName = data[0].trim()
        } else {
          mutAllData.data[groupName].push(data.map(d => d.trim()))
        }
        groupName = data[0].trim()
      } else {
        groupName = groupName || 'default'
        if (!mutAllData.data[groupName]) {
          mutAllData.data[groupName] = []
        }
        mutAllData.data[groupName].push(data.map(d => d.trim()))
      }
    },
    complete: function() {
      console.log('parsing done!')
      writeCSV()
      // #TODO: cleanup  data?? like:
      // allData.data = {}
      // props.setActionModalOpen(false)
    },
    error: function(e) {
      console.warn('onoz, parse caught error:', e)
    }
  })
}

function writeCSV() {
  Object.keys(mutAllData.data).forEach(key => {
    var ocsv = {
      fields: mutAllData.header,
      data: mutAllData.data[key]
    }
    var csv = Papa.unparse(ocsv)
    fs.writeFile(`${key}.csv`, csv, 'utf-8', () =>
      console.log(`wrote ${key}.csv`)
    )
  })
}
