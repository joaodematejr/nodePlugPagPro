const path = require('path')
const ffi = require('ffi-napi')

function loadLibraries() {
  const dllPagSeguro = path.resolve(__dirname, '..', 'bin', 'PPPagSeguro.dll')
  const dllBTSerial = path.resolve(__dirname, '..', 'bin', 'BTSerial.dll')
  const dllPlugPag = path.resolve(__dirname, '..', 'bin', 'PlugPag.dll')
  return dllPagSeguro
}

const bluetooth_port = 'COM5'
const app_name = 'PlugPagNode'
const app_version = '1.0.0'
const encoding = 'UTF-8'

//GetVersionLib

/* var pagSeguro = ffi.Library(dllPagSeguro, {
  GetVersionLib: ['int', []],
})

console.log(pagSeguro.GetVersionLib()) */

function renderErr(codResponse) {
  const urlPagSeguro = 'https://dev.pagseguro.uol.com.br/reference/plugpag-windows#listagem-de-erros'
  switch (codResponse) {
    case 0:
      console.log('Transação autorizada')
      break
    default:
      console.log(`Verificar a tabela de erros ${response} ${urlPagSeguro}`)
      break
  }
}

async function initPlugPag(pagSeguroLib) {
  console.log('Definindo nome e versão da aplicação... ')
  let pgVersion = ffi.Library(pagSeguroLib, {
    SetVersionName: ['int', ['string', 'string']],
  })
  let response = await pgVersion.SetVersionName(app_name, app_version)
  renderErr(response)
}

function main() {
  pp = loadLibraries()
  initPlugPag(pp)
}

main()
