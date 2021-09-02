const path = require('path')
const ffi = require('ffi-napi')
var readline = require('readline')

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

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function renderErr(codResponse) {
  const urlPagSeguro =
    'https://dev.pagseguro.uol.com.br/reference/plugpag-windows#listagem-de-erros'
  switch (codResponse) {
    case 0:
      break
    default:
      console.log(`Verificar a tabela de erros ${codResponse} ${urlPagSeguro}`)
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

async function initPlugPagBluetooth(pagSeguroLib) {
  console.log('Configurando conexao bluetooth... ')
  let pgBluetooth = ffi.Library(pagSeguroLib, {
    InitBTConnection: ['int', ['string']],
  })
  let response = await pgBluetooth.InitBTConnection(bluetooth_port)
  renderErr(response)
}

//VERSÃO
function getVersion(dllPagSeguro) {
  console.log('Recuperando Versão... ')
  let pg = ffi.Library(dllPagSeguro, {
    GetVersionLib: ['int', []],
  })
  return pg.GetVersionLib()
}

//PAGAMENTO
async function handlePayment(dllPagSeguro) {
  console.log('Aguardando pagamento...')
  let pagSeguro = ffi.Library(dllPagSeguro, {
    SimplePaymentTransaction:  ['int', ['int', 'int', 'int', 'string', 'string', 'string']],
  })
  let transactionResult = {};
  try {
    let response = await pagSeguro.SimplePaymentTransaction(1, 1, 1, '100', 'UserRef', transactionResult)
    console.log('62', response)
  } catch (error) {
    console.log('error', error)
  }
}

function main() {
  pp = loadLibraries()
  initPlugPag(pp)
  //initPlugPagBluetooth(pp)
  console.log('\n\n*** Pressione Ctrl+C para finalizar a aplicação ***')
  var leitor = function () {
    rl.question(
      `1 - Pagar \n2 - Entornar (cancelar pagamento) \n3 - Consultar ultima transacao \n4 - Versão \n`,
      function (comando) {
        switch (comando) {
          case '1':
            handlePayment(pp)
            break
          case '2':
            console.log('222222222222222')
            break
          case '3':
            console.log('333333333333333')
            break
          case '4':
            let responseVersion = getVersion(pp)
            console.log(`Versão ${responseVersion}`)
            break
          default:
            console.log('!!! Opção invalida !!!')
            break
        }
        leitor()
      },
    )
  }
  leitor()
}

console.log(`Aplicação de demonstração da biblioteca PlugPag com integração para Node rodando no sistema
operation Windows.
Testado no Windows 10, com Node 14.17.2`)
main()
