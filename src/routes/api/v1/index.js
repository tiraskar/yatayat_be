const express = require('express');

const adminRoutes = require('./admin');
const roleRoutes = require('./role');
const userRoutes = require('./user');
const productRoutes = require('./product');
const orderRoutes = require('./order');
const membershipRoutes = require('./membership');
const kycRoutes = require('./kyc');
const certificateRoutes = require('./certificate');
const memberRoutes = require('./member');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Memebership API V1 Root'
  });
});

router.use('/admin', adminRoutes);
router.use('/role', roleRoutes);
router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/membership', membershipRoutes);
router.use('/kyc', kycRoutes);
router.use('/certificate', certificateRoutes);
router.use('/member', memberRoutes);

module.exports = router;
