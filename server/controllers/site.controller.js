import httpStatus from 'http-status';

import catchAsync from '../utils/catchAsync.js';
import siteService from '../services/site.service.js';

const listSites = catchAsync(async (req, res) => {
    const result = await siteService.listSites(req.query);
    return res.status(httpStatus.OK).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
    });
});

const createSite = catchAsync(async (req, res) => {
    const site = await siteService.createSite(req.body);
    return res.status(httpStatus.CREATED).json({
        success: true,
        data: site,
    });
});

const getSite = catchAsync(async (req, res) => {
    const site = await siteService.getSiteById(req.params.id);
    return res.status(httpStatus.OK).json({
        success: true,
        data: site,
    });
});

const updateSite = catchAsync(async (req, res) => {
    const site = await siteService.updateSite(req.params.id, req.body);
    return res.status(httpStatus.OK).json({
        success: true,
        data: site,
    });
});

const deleteSite = catchAsync(async (req, res) => {
    await siteService.deleteSite(req.params.id);
    return res.status(httpStatus.OK).json({
        success: true,
        message: 'Site deleted',
    });
});

export default {
    listSites,
    createSite,
    getSite,
    updateSite,
    deleteSite,
};
