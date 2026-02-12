import httpStatus from 'http-status';

import catchAsync from '../utils/catchAsync.js';
import dashboardService from '../services/dashboard.service.js';


// Goal:  high-level metrics

const getOverview = catchAsync(async (req, res) => {
  const stats = await dashboardService.getOverviewStats();

  return res.status(httpStatus.OK).json({
    success: true,
    data: stats,
  });
});

export default {
  getOverview,
};
