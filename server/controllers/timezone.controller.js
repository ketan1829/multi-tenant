import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';

const listTimezones = catchAsync(async (req, res) => {
    const response = await fetch('https://timeapi.io/api/TimeZone/AvailableTimeZones');

    if (!response.ok) {
        throw new ApiError(
            httpStatus.BAD_GATEWAY,
            'Failed to fetch timezones from TimeAPI'
        );
    }

    const timezones = await response.json();

    return res.status(httpStatus.OK).json({
        success: true,
        count: timezones.length,
        data: timezones,
    });
});

export default {
    listTimezones,
};
