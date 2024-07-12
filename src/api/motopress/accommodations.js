const motopressService = require('../../services/motopress.service')

async function getAccommodationById(accomodationId) {
  try {
    const response = await motopressService.get(
      `/accommodation_types/${accomodationId}`
    )
    console.log('Acomodation ==>', response.data)
  } catch (error) {
    console.error('Error fetching accommodation by id:', error)
    throw error
  }
}

module.exports = {
  getAccommodationById,
}
