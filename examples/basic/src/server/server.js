import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'
import { SheetsRegistryProvider, SheetsRegistry } from 'react-jss'
import App from '../react-app/app'

const port = process.env['PORT'] || 5000
const app = new express()

app.use(express.static('dist'))
app.get('/*', (req, res) => {
  const sheets = new SheetsRegistry()
  const renderElements = renderToString(
    <SheetsRegistryProvider registry={sheets}>
      <App />
    </SheetsRegistryProvider>
  )
  const renderStyles = sheets.toString()
  const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>SSR jss-from-postcss example</title>
        <style type="text/css" id="server-side-styles">${renderStyles}</style>
      </head>
      <body>
        <div id="root">${renderElements}</div>
        <script type="text/javascript" src="app.js"></script>
      </body>
  </html>`
  res.status(200).send(html)
})

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`)
})