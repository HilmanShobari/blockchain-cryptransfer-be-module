export default class QrController {
  public static async createQr(request) {
    try {
      if (!request.destinationAddress || !request.value) {
        return QrController.errorHandler({
          status_code: 400,
          message: 'bad request',
        })
      }

      let qrValue: string
      if (!!request.tokenAddress) {
        qrValue = `ethereum:${request.tokenAddress}@${request.chainId}/transfer?address=${request.destinationAddress}&uint256=${request.value}`
      } else {
        qrValue = `ethereum:${request.destinationAddress}?value=${request.value}`
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
}
