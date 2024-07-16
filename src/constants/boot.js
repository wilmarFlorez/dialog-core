const steps = {
  SELECT_SERVICE: 'select_service',
  CHECK_IN: 'check_in',
  CHECK_OUT: 'check_out',
  NUMBER_OF_ADULTS: 'number_of_adults',
  NUMBER_OF_CHILDREN: 'number_of_children',
  BOOKINGS_AVAILABILITY: 'bookings_availability',
}

const MAX_LENGTH_BOOKINGS_AVAILABLE = 10

module.exports = {
  steps,
  MAX_LENGTH_BOOKINGS_AVAILABLE,
}
