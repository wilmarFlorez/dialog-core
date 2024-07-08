const motopressService = require('../../services/motopress.service')

async function getBookings() {
  try {
    const response = await motopressService.get('/bookings')
    console.log('Motopress response', response)
    return response.data
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }
}

module.exports = { getBookings }
