import React, { useEffect, useState } from 'react';
import {
    Table,
    TextInput,
    Select,
    Group,
    Button,
    Loader,
    Text,
    Paper,
    Stack,
    Pagination,
    Alert,
} from '@mantine/core';

import {
    IconSearch,
    IconRefresh,
    IconUserPlus,
    IconPencil,
    IconBan,
    IconAlertCircle,
} from '@tabler/icons-react';
import usersApi from '../api/users.api.js';
import useAuth from '../hooks/useAuth.js';
import StatusPill from '../components/common/StatusPill.jsx';
import UserFormModal from '../components/users/UserFormModal.jsx';

const UsersPage = () => {
    const { hasPermission } = useAuth();

    const canRead = hasPermission('users:read');
    const canCreate = hasPermission('users:create');
    const canUpdate = hasPermission('users:update');
    const canDeactivate = hasPermission('users:deactivate');

    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalUser, setModalUser] = useState(null);
    const [modalSubmitting, setModalSubmitting] = useState(false);

    const fetchUsers = async (page = 1) => {
        if (!canRead) return;
        setLoading(true);
        setError('');
        try {
            const result = await usersApi.getUsers({
                page,
                limit: pagination.limit,
                search,
                status: statusFilter,
            });
            setUsers(result.data);
            setPagination((prev) => ({
                ...prev,
                page,
                total: result.pagination.total,
                totalPages: result.pagination.totalPages,
            }));
        } catch (err) {
            const message =
                err.response?.data?.message || 'Failed to load users';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, statusFilter]);

    const handlePageChange = (page) => {
        fetchUsers(page);
    };

    const openCreateModal = () => {
        setModalUser(null);
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setModalUser(user);
        setModalOpen(true);
    };

    const handleModalSubmit = async (payload) => {
        setModalSubmitting(true);
        try {
            if (modalUser?.id) {
                await usersApi.updateUser(modalUser.id, payload);
            } else {
                await usersApi.createUser(payload);
            }
            await fetchUsers(pagination.page);
            setModalOpen(false);
            setModalUser(null);
        } catch (err) {
            const message =
                err.response?.data?.message || 'Failed to save user';
            alert(message); // can be replaced with Mantine notifications
        } finally {
            setModalSubmitting(false);
        }
    };

    const handleDeactivate = async (user) => {
        if (!canDeactivate || user.status === 'inactive') return;

        // eslint-disable-next-line no-alert
        const confirmed = window.confirm(
            `Deactivate user "${user.name}"? They will no longer be able to log in.`
        );
        if (!confirmed) return;

        setActionLoading(true);
        try {
            await usersApi.deactivateUser(user.id);
            await fetchUsers(pagination.page);
        } catch (err) {
            const message =
                err.response?.data?.message || 'Failed to deactivate user';
            alert(message);
        } finally {
            setActionLoading(false);
        }
    };

    if (!canRead) {
        return <Text>You do not have permission to view users.</Text>;
    }

    return (
        <div>
            <Text className="page-title">Users</Text>

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

            <Paper shadow="xs" p="md" mb="md" withBorder>
                <Stack gap="sm">
                    <Group justify="space-between" align="flex-end">
                        <Group gap="sm" wrap="wrap">
                            <TextInput
                                label="Search"
                                placeholder="Name or email"
                                leftSection={<IconSearch size={16} />}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                size="sm"
                                w={220}
                            />
                            <Select
                                label="Status"
                                placeholder="All"
                                data={[
                                    { value: '', label: 'All' },
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' },
                                ]}
                                value={statusFilter}
                                onChange={(value) => setStatusFilter(value || '')}
                                clearable
                                size="sm"
                                w={160}
                            />
                        </Group>
                        <Group gap="sm">
                            <Button
                                variant="subtle"
                                size="xs"
                                onClick={() => {
                                    setSearch('');
                                    setStatusFilter('');
                                }}
                            >
                                Clear filters
                            </Button>
                            <Button
                                variant="light"
                                color="blue"
                                leftSection={<IconRefresh size={16} />}
                                onClick={() => fetchUsers(pagination.page)}
                                size="xs"
                            >
                                Refresh
                            </Button>
                            {canCreate && (
                                <Button
                                    variant="filled"
                                    color="blue"
                                    leftSection={<IconUserPlus size={16} />}
                                    onClick={openCreateModal}
                                    size="xs"
                                >
                                    New user
                                </Button>
                            )}
                        </Group>
                    </Group>
                </Stack>
            </Paper>

            <Paper shadow="xs" p="md" withBorder>
                {loading ? (
                    <Group justify="center" py="xl">
                        <Loader size="md" />
                    </Group>
                ) : (
                    <>
                        <Table striped highlightOnHover withTableBorder withColumnBorders>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>Role</Table.Th>
                                    <Table.Th>Site</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {users.length === 0 && (
                                    <Table.Tr>
                                        <Table.Td colSpan={6}>
                                            <Text fz="sm" c="dimmed">
                                                No users found. Try adjusting filters or create a new user.
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                                {users.map((u) => (
                                    <Table.Tr key={u.id}>
                                        <Table.Td>{u.name}</Table.Td>
                                        <Table.Td>{u.email}</Table.Td>
                                        <Table.Td>{u.role ? u.role.name : '-'}</Table.Td>
                                        <Table.Td>{u.site ? u.site.name : '-'}</Table.Td>
                                        <Table.Td>
                                            <StatusPill status={u.status} />
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                {canUpdate && (
                                                    <Button
                                                        variant="subtle"
                                                        size="xs"
                                                        leftSection={<IconPencil size={14} />}
                                                        onClick={() => openEditModal(u)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                                {canDeactivate && u.status === 'active' && (
                                                    <Button
                                                        variant="subtle"
                                                        color="red"
                                                        size="xs"
                                                        leftSection={<IconBan size={14} />}
                                                        onClick={() => handleDeactivate(u)}
                                                        loading={actionLoading}
                                                    >
                                                        Deactivate
                                                    </Button>
                                                )}
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>

                        <Group justify="space-between" mt="md" align="center">
                            <Text fz="sm" c="dimmed">
                                Page {pagination.page} of {pagination.totalPages} · {pagination.total} users
                            </Text>
                            <Pagination
                                value={pagination.page}
                                onChange={handlePageChange}
                                total={pagination.totalPages || 1}
                                size="sm"
                            />
                        </Group>
                    </>
                )}
            </Paper>

            <UserFormModal
                opened={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setModalUser(null);
                }}
                onSubmit={handleModalSubmit}
                initialUser={modalUser}
                submitting={modalSubmitting}
            />
        </div>
    );
};

export default UsersPage;
