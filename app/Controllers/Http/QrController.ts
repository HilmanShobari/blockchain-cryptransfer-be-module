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
        newValue = `${request.value + addValue}e${request.decimal}`
      } else {
        addValue =
          this.generateZeroString(parseInt(request.decimal) - randomNumber.toString().length) +
          randomNumber
        newValue = `${request.value}.${addValue}e${request.decimal}`
      }

      let qrValue: string
      if (!!request.tokenAddress) {
        qrValue = `ethereum:${request.tokenAddress}@${request.chainId}/transfer?address=${request.destinationAddress}&uint256=${newValue}`
      } else {
        qrValue = `ethereum:${request.destinationAddress}?value=${newValue}`
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
