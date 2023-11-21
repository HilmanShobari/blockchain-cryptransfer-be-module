export default class QrController {
  public static async createQr(request) {
    try {
      if (!request.address || !request.value) {
        return QrController.errorHandler({
          status_code : 400,
          message : "bad request"
        })
      }

      const qrValue = `ethereum:${request.address}?value=${request.value}`

      return {
        status_code: 201,
        message: 'Qr value created successfully',
        data: {
          address: request.address,
          value: request.value,
          qrValue: qrValue,
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
