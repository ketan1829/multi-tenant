

import User from '../models/User.js';
import Role from '../models/Role.js';
import Site from '../models/Site.js';

// Goal: counts users, active users, roles, and sites


const getOverviewStats = async () => {
    const [totalUsers, activeUsers, totalRoles, totalSites] = await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ status: 'active' }),
        Role.countDocuments({}),
        Site.countDocuments({}),
    ]);

    return {
        totalUsers,
        activeUsers,
        totalRoles,
        totalSites,
    };
};

export default {
    getOverviewStats,
};
