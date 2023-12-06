import Env from '@ioc:Adonis/Core/Env'

export default class QrController {
  public static async createQr(request) {
    try {
      if (!request.destinationAddress || !request.value) {
        return QrController.errorHandler({
          status_code: 400,
          message: 'bad request',
        })
      }

      let newValue: string
      let addValue: string
      let DigitsAfterDecimalPoint = 0

      const randomNumber = this.generateRandomNumber(Env.get('UNIQUE_CODE_LENGTH'))

      // check if the value has decimal
      if (request.value.includes('.')) {
        DigitsAfterDecimalPoint = request.value.split('.')[1].length
        addValue =
          this.generateZeroString(
            parseInt(request.decimal) - randomNumber.toString().length - DigitsAfterDecimalPoint
          ) + randomNumber
        newValue = `${request.value + addValue}`
      } else {
        addValue =
          this.generateZeroString(parseInt(request.decimal) - randomNumber.toString().length) +
          randomNumber
        newValue = `${request.value}.${addValue}`
      }

      let qrValue: string = ''
      // using metamask
      if (request.walletType === 'metamask') {
        if (request.tokenAddress) {
          qrValue = `ethereum:${request.tokenAddress}@${request.chainId}/transfer?address=${request.destinationAddress}&uint256=${newValue}e${request.decimal}`
        } else {
          qrValue = `ethereum:${request.destinationAddress}@${request.chainId}?value=${newValue}e${request.decimal}`
        }
        // using trustwallet
      } else if (request.walletType === 'trustwallet') {
        if (request.network === 'ethereum') {
          // not native coin
          if (request.tokenAddress) {
            qrValue = `https://link.trustwallet.com/send?asset=${Env.get('ETHEREUM_UAI')}_t${
              request.tokenAddress
            }&address=${request.destinationAddress}&amount=${newValue}`
            // native coin
          } else {
            qrValue = `https://link.trustwallet.com/send?asset=${Env.get('ETHEREUM_UAI')}&address=${
              request.destinationAddress
            }&amount=${newValue}`
          }
        } else if (request.network === 'binance') {
          // not native coin
          if (request.tokenAddress) {
            qrValue = `https://link.trustwallet.com/send?asset=${Env.get('BINANCE_UAI')}_t${
              request.tokenAddress
            }&address=${request.destinationAddress}&amount=${newValue}`
            // native coin
          } else {
            qrValue = `https://link.trustwallet.com/send?asset=${Env.get('BINANCE_UAI')}&address=${
              request.destinationAddress
            }&amount=${newValue}`
          }
        } else if (request.network === 'polygon') {
          // not native coin
          if (request.tokenAddress) {
            qrValue = `https://link.trustwallet.com/send?asset=${Env.get('POLYGON_UAI')}_t${
              request.tokenAddress
            }&address=${request.destinationAddress}&amount=${newValue}`
            // native coin
          } else {
            qrValue = `https://link.trustwallet.com/send?asset=${Env.get('POLYGON_UAI')}&address=${
              request.destinationAddress
            }&amount=${newValue}`
          }
        }
      }

      return {
        status_code: 201,
        message: 'Qr value created successfully',
        data: {
          request,
          qrValue,
        },
      }
    } catch (error) {
      return QrController.errorHandler(error)
    }
  }

  // error handler
  private static async errorHandler(error) {
    return {
      status_code: error.status_code || 500,
      message: error.message || 'Internal Server Error',
    }
  }

  // random number generator
  private static generateRandomNumber(length) {
    const min = 10 ** (length - 1)
    const max = 10 ** length - 1

    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // zero string generator
  private static generateZeroString(digitCount) {
    if (digitCount <= 0) {
      return ''
    }

    let zeroString = ''
    for (let i = 0; i < digitCount; i++) {
      zeroString += '0'
    }

    return zeroString
  }
}
