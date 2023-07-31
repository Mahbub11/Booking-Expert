

const router = require('express').Router();
const { isAuthenticatedUser, isBlocked, isAdmin } = require('../middleware/app.authentication');
const {
  placedBookingOrder, getBookingOrderByUserId, cancelSelfBookingOrder,setBookingStatus, getBookingOrderForAdmin,getBookingByBookingId, updatedBookingOrderByAdmin
} = require('../controllers/booking.controllers');

// route for placed a room booking order
router.route('/placed-booking-order/:id').post(isAuthenticatedUser, isBlocked, placedBookingOrder);

// routes for a user get bookings list and cancel booking order
router.route('/get-user-booking-orders').get(isAuthenticatedUser, isBlocked, getBookingOrderByUserId);
router.route('/cancel-booking-order/:id').put(isAuthenticatedUser, isBlocked, cancelSelfBookingOrder);

// routes for admin get all bookings list, rejected, approved and checkout placed order
router.route('/get-all-booking-orders').get(isAuthenticatedUser, isBlocked, isAdmin, getBookingOrderForAdmin);
router.route('/get-all-booking-orders/:orderId').get(isAuthenticatedUser, isBlocked, isAdmin, getBookingByBookingId);
router.route('/updated-booking-order/:id').put(isAuthenticatedUser, isBlocked, isAdmin, updatedBookingOrderByAdmin);
router.route('/set-status/:bookingId').put( setBookingStatus)

module.exports = router;
