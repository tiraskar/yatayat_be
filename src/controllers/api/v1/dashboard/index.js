const DashBoardService = require('../../../../service/dashboard');
const logger = require('../../../../utils/logger');

const getDashboardData = async (req, res, next) => {
  try {

    const { fromDate, toDate } = req.query;

    const response = await DashBoardService.getDashboardData(fromDate, toDate);

    res.status(200).json({
      message: 'Dashboard data list fetched successfully.',
      response
    });
  } catch (error) {
    logger.error('Error on fetching dashboard data', error);
    next(error);
  }
};

module.exports = {
  getDashboardData
};
