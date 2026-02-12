import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import authService from '../services/auth.service.js';

const login = catchAsync(async (req, res) => {

    console.log("req.body | ", req.body);
    

    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.status(httpStatus.OK).json({
        success: true,
        data: result,
    });
});

const seedAdmin = catchAsync(async (req, res) => {
    await authService.seedInitialAdmin();
    return res.status(httpStatus.OK).json({
        success: true,
        message: 'Admin seeded (if not existing)',
    });
});

export default {
    login,
    seedAdmin,
};
