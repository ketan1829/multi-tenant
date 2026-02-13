import React, { useEffect, useMemo, useState } from 'react';
import {
    Paper,
    SimpleGrid,
    Text,
    Group,
    Loader,
    Alert,
    Skeleton,
    Badge,
    Stack,
} from '@mantine/core';
import {
    IconUsers,
    IconUserCheck,
    IconShield,
    IconBuilding,
    IconAlertCircle,
} from '@tabler/icons-react';
import dashboardApi from '../api/dashboardApi.js';

const StatCard = ({ label, value, icon: Icon, color, helper }) => (
    <Paper
        shadow="sm"
        radius="lg"
        withBorder
        p={{ base: 'sm', sm: 'md' }}            // smaller padding on mobile
    >
        <Group justify="space-between" align="flex-start" gap="sm" wrap="nowrap">
            <div style={{ minWidth: 0 }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} truncate>
                    {label}
                </Text>
                <Text size="xl" fw={700} mt={4}>
                    {value}
                </Text>
                {helper && (
                    <Text size="xs" c="dimmed" mt={4} lineClamp={2}>
                        {helper}
                    </Text>
                )}
            </div>
            <Paper
                radius="xl"
                p={6}
                style={{ backgroundColor: `${color}15`, color, flexShrink: 0 }}
            >
                <Icon size={26} />
            </Paper>
        </Group>
    </Paper>
);

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalRoles: 0,
        totalSites: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const loadStats = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await dashboardApi.getOverview();
                if (mounted) setStats(data);
            } catch (err) {
                if (mounted) {
                    const message =
                        err.response?.data?.message || 'Failed to load dashboard';
                    setError(message);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadStats();

        return () => {
            mounted = false;
        };
    }, []);

    const activeRatio = useMemo(() => {
        if (!stats.totalUsers) return 0;
        return Math.round((stats.activeUsers / stats.totalUsers) * 100);
    }, [stats]);

    return (
        <Stack gap="md">
            <Group
                justify="space-between"
                align="flex-start"
                wrap="wrap"
                gap="xs"
            >
                <div>
                    <Text className="page-title">Dashboard</Text>
                    <Text size="sm" c="dimmed">
                        Quick overview of tenants, users and access control.
                    </Text>
                </div>
                {!loading && (
                    <Badge
                        variant="light"
                        color="green"
                        size="sm"
                        radius="xl"
                        mt={{ base: 'xs', sm: 0 }}
                    >
                        {stats.totalUsers} users · {stats.totalRoles} roles ·{' '}
                        {stats.totalSites} sites
                    </Badge>
                )}
            </Group>

            {error && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    variant="light"
                >
                    {error}
                </Alert>
            )}

            {loading ? (
                <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 4 }}   // 1 col on phones, 2 on tablets, 4 on desktop
                    spacing={{ base: 'sm', sm: 'md' }} // tighter spacing on mobile
                >
                    <Skeleton height={96} radius="lg" />
                    <Skeleton height={96} radius="lg" />
                    <Skeleton height={96} radius="lg" />
                    <Skeleton height={96} radius="lg" />
                </SimpleGrid>
            ) : (
                <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 4 }}
                    spacing={{ base: 'sm', sm: 'md' }}
                >
                    <StatCard
                        label="Total users"
                        value={stats.totalUsers}
                        icon={IconUsers}
                        color="#2563eb"
                        helper={
                            stats.totalUsers
                                ? 'All registered user accounts'
                                : 'No users created yet'
                        }
                    />
                    <StatCard
                        label="Active users"
                        value={stats.activeUsers}
                        icon={IconUserCheck}
                        color="#16a34a"
                        helper={
                            stats.totalUsers
                                ? `${activeRatio}% of users are currently active`
                                : 'Create users to see activity'
                        }
                    />
                    <StatCard
                        label="Roles"
                        value={stats.totalRoles}
                        icon={IconShield}
                        color="#7c3aed"
                        helper="Manage access via role permissions"
                    />
                    <StatCard
                        label="Sites"
                        value={stats.totalSites}
                        icon={IconBuilding}
                        color="#f97316"
                        helper={
                            stats.totalSites
                                ? 'Sites configured with timezone and status'
                                : 'No sites configured yet'
                        }
                    />
                </SimpleGrid>
            )}
        </Stack>
    );
};

export default DashboardPage;
