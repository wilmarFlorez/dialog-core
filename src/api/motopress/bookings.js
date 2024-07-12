const motopressService = require('../../services/motopress.service')

async function getBookings() {
  try {
    const response = await motopressService.get('/bookings')
    console.log('Motopress response', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }
}

async function getBookingsAvailability(
  checkIn,
  checkOut,
  numberOfAdults,
  numberOfChildren
) {
  try {
    const response = await motopressService.get(`/bookings/availability`, {
      params: {
        check_in_date: checkIn,
        check_out_date: checkOut,
        adults: numberOfAdults,
        children: numberOfChildren,
        _embed: true,
      },
    })

    return response.data.availability
  } catch (error) {
    console.error('Error fetching bookings availability:', error)
    throw error
  }
}

module.exports = { getBookings, getBookingsAvailability }
