import React, { useEffect, useState } from 'react';

import { Paper, SimpleGrid, Text, Group, Loader, Alert } from '@mantine/core';
import { IconUsers, IconUserCheck, IconShield, IconBuilding, IconAlertCircle } from '@tabler/icons-react';

import dashboardApi from '../api/dashboardApi.js';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <Paper shadow="sm" radius="lg" p="md" withBorder>
        <Group justify="space-between" align="flex-start">
            <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    {label}
                </Text>
                <Text size="xl" fw={700} mt={4}>
                    {value}
                </Text>
            </div>
            <Paper
                radius="xl"
                p={6}
                style={{ backgroundColor: `${color}15`, color }}
            >
                <Icon size={30} />
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
                    const message = err.response?.data?.message || 'Failed to load dashboard';
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

    return (
        <div>
            <Text className="page-title">Dashboard</Text>

            {error && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    variant="light"
                    mb="md"
                >
                    {error}
                </Alert>
            )}

            {loading ? (
                <Group justify="center" py="xl">
                    <Loader size="md" />
                </Group>
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
                    <StatCard
                        label="Total users"
                        value={stats.totalUsers}
                        icon={IconUsers}
                        color="#2563eb"
                    />
                    <StatCard
                        label="Active users"
                        value={stats.activeUsers}
                        icon={IconUserCheck}
                        color="#16a34a"
                    />
                    <StatCard
                        label="Total roles"
                        value={stats.totalRoles}
                        icon={IconShield}
                        color="#7c3aed"
                    />
                    <StatCard
                        label="Total sites"
                        value={stats.totalSites}
                        icon={IconBuilding}
                        color="#f97316"
                    />
                </SimpleGrid>
            )}
        </div>
    );
};

export default DashboardPage;
