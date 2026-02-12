import httpStatus from 'http-status';
import Site from '../models/Site.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { getPagination } from '../utils/pagination.js';

const listSites = async (query) => {
    const { page, limit, skip } = getPagination(query);

    const filter = {};

    if (query.status) {
        filter.status = query.status;
    }

    if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [{ name: regex }, { location: regex }];
    }

    const sitesPromise = Site.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const countPromise = Site.countDocuments(filter);

    const [sites, total] = await Promise.all([sitesPromise, countPromise]);

    const totalPages = Math.ceil(total / limit);

    return {
        data: sites.map((s) => ({
            id: s._id.toString(),
            name: s.name,
            location: s.location,
            timezone: s.timezone,
            status: s.status,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };
};

const createSite = async (payload) => {
    const site = await Site.create({
        name: payload.name.trim(),
        location: payload.location || '',
        timezone: payload.timezone || '',
        status: payload.status || 'active',
    });

    return {
        id: site._id.toString(),
        name: site.name,
        location: site.location,
        timezone: site.timezone,
        status: site.status,
        createdAt: site.createdAt,
        updatedAt: site.updatedAt,
    };
};

const getSiteById = async (id) => {
    const site = await Site.findById(id);
    if (!site) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Site not found');
    }

    return {
        id: site._id.toString(),
        name: site.name,
        location: site.location,
        timezone: site.timezone,
        status: site.status,
        createdAt: site.createdAt,
        updatedAt: site.updatedAt,
    };
};

const updateSite = async (id, payload) => {
    const site = await Site.findById(id);
    if (!site) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Site not found');
    }

    if (payload.name) {
        site.name = payload.name.trim();
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'location')) {
        site.location = payload.location || '';
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'timezone')) {
        site.timezone = payload.timezone || '';
    }

    if (payload.status) {
        site.status = payload.status;
    }

    await site.save();

    return {
        id: site._id.toString(),
        name: site.name,
        location: site.location,
        timezone: site.timezone,
        status: site.status,
        createdAt: site.createdAt,
        updatedAt: site.updatedAt,
    };
};

const deleteSite = async (id) => {
    const site = await Site.findById(id);
    if (!site) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Site not found');
    }

    const userCount = await User.countDocuments({ site: site._id });

    if (userCount > 0) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Cannot delete site: it is assigned to one or more users'
        );
    }

    await Site.findByIdAndDelete(site._id);
};

export default {
    listSites,
    createSite,
    getSiteById,
    updateSite,
    deleteSite,
};
