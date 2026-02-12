import React, { useEffect, useState } from 'react';

import {
    Table,
    TextInput,
    Button,
    Group,
    Loader,
    Text,
    Paper,
    Stack,
    Pagination,
    TagsInput,
    Checkbox,
} from '@mantine/core';
import { IconSearch, IconPlus, IconRefresh, IconTrash, IconDeviceFloppy } from '@tabler/icons-react';

import rolesApi from '../api/roles.api.js';
import useAuth from '../hooks/useAuth.js';

const EMPTY_ROLE_FORM = {
    id: null,
    name: '',
    description: '',
    permissions: [],
    isSystem: false,
};

const RolesPage = () => {
    const { hasPermission } = useAuth();

    const canRead = hasPermission('roles:read');
    const canCreate = hasPermission('roles:create');
    const canUpdate = hasPermission('roles:update');
    const canDelete = hasPermission('roles:delete');

    const [roles, setRoles] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');
    const [roleForm, setRoleForm] = useState(EMPTY_ROLE_FORM);
    const [isEditing, setIsEditing] = useState(false);

    const fetchRoles = async (page = 1) => {
        if (!canRead) return;
        setLoading(true);
        setError('');
        try {
            const result = await rolesApi.getRoles({
                page,
                limit: pagination.limit,
                search,
            });
            setRoles(result.data);
            setPagination((prev) => ({
                ...prev,
                page,
                total: result.pagination.total,
                totalPages: result.pagination.totalPages,
            }));
        } catch (err) {
            const message =
                err.response?.data?.message || 'Failed to load roles';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handlePageChange = (page) => {
        fetchRoles(page);
    };

    const handleStartCreate = () => {
        setRoleForm(EMPTY_ROLE_FORM);
        setIsEditing(false);
        setFormError('');
    };

    const handleStartEdit = (role) => {
        setRoleForm({
            id: role.id,
            name: role.name,
            description: role.description || '',
            permissions: role.permissions || [],
            isSystem: role.isSystem,
        });
        setIsEditing(true);
        setFormError('');
    };

    const handleFormChange = (field, value) => {
        setRoleForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canCreate && !isEditing) return;
        if (!canUpdate && isEditing) return;

        if (!roleForm.name.trim()) {
            setFormError('Role name is required');
            return;
        }

        setSaving(true);
        setFormError('');
        try {
            if (isEditing && roleForm.id) {
                await rolesApi.updateRole(roleForm.id, {
                    name: roleForm.name,
                    description: roleForm.description,
                    permissions: roleForm.permissions,
                });
            } else {
                await rolesApi.createRole({
                    name: roleForm.name,
                    description: roleForm.description,
                    permissions: roleForm.permissions,
                });
            }

            await fetchRoles(pagination.page);
            setRoleForm(EMPTY_ROLE_FORM);
            setIsEditing(false);
        } catch (err) {
            const message =
                err.response?.data?.message || 'Failed to save role';
            setFormError(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (role) => {
        if (!canDelete || role.isSystem) return;
        // Basic confirm; you can switch to Mantine modals later. [web:146][web:154]
        // eslint-disable-next-line no-alert
        const confirmed = window.confirm(
            `Delete role "${role.name}"? This cannot be undone.`
        );
        if (!confirmed) return;

        setSaving(true);
        try {
            await rolesApi.deleteRole(role.id);
            await fetchRoles(pagination.page);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                'Failed to delete role (maybe it is assigned to users)';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    if (!canRead) {
        return <Text>You do not have permission to view roles.</Text>;
    }

    return (
        <div>
            <div className="page-title">Roles</div>

            <Paper shadow="xs" p="md" mb="md">
                <Stack gap="sm">
                    <Group justify="space-between" align="center">
                        <Group gap="sm" wrap="wrap">
                            <TextInput
                                placeholder="Search roles"
                                leftSection={<IconSearch size={16} />}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                size="sm"
                            />
                        </Group>
                        <Group gap="sm">
                            <Button
                                variant="light"
                                color="blue"
                                leftSection={<IconRefresh size={16} />}
                                onClick={() => fetchRoles(pagination.page)}
                                size="sm"
                            >
                                Refresh
                            </Button>
                            {canCreate && (
                                <Button
                                    variant="filled"
                                    color="blue"
                                    leftSection={<IconPlus size={16} />}
                                    onClick={handleStartCreate}
                                    size="sm"
                                >
                                    New role
                                </Button>
                            )}
                        </Group>
                    </Group>
                    {error && <Text c="red" fz="sm">{error}</Text>}
                </Stack>
            </Paper>

            {(canCreate || isEditing) && (
                <Paper shadow="xs" p="md" mb="md">
                    <form onSubmit={handleSubmit}>
                        <Stack gap="sm">
                            <Group grow align="flex-start">
                                <TextInput
                                    label="Role name"
                                    placeholder="Admin, Manager, Viewer..."
                                    value={roleForm.name}
                                    onChange={(e) => handleFormChange('name', e.target.value)}
                                    required
                                    size="sm"
                                />
                                <TextInput
                                    label="Description"
                                    placeholder="Describe this role"
                                    value={roleForm.description}
                                    onChange={(e) => handleFormChange('description', e.target.value)}
                                    size="sm"
                                />
                            </Group>
                            <TagsInput
                                label="Permissions"
                                description="Add permission keys like users:read, roles:create, sites:delete"
                                placeholder="Type permission and press Enter"
                                value={roleForm.permissions}
                                onChange={(value) => handleFormChange('permissions', value)}
                                size="sm"
                            />
                            {roleForm.isSystem && (
                                <Checkbox
                                    label="System role (cannot be deleted or fully edited)"
                                    checked
                                    readOnly
                                />
                            )}
                            {formError && <Text c="red" fz="sm">{formError}</Text>}
                            <Group justify="flex-end">
                                {isEditing && (
                                    <Button
                                        variant="subtle"
                                        color="gray"
                                        onClick={() => {
                                            setRoleForm(EMPTY_ROLE_FORM);
                                            setIsEditing(false);
                                            setFormError('');
                                        }}
                                        size="sm"
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    leftSection={<IconDeviceFloppy size={16} />}
                                    color="blue"
                                    type="submit"
                                    size="sm"
                                    loading={saving}
                                >
                                    {isEditing ? 'Update role' : 'Create role'}
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Paper>
            )}

            <Paper shadow="xs" p="md">
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
                                    <Table.Th>Description</Table.Th>
                                    <Table.Th>Permissions</Table.Th>
                                    <Table.Th>System</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {roles.length === 0 && (
                                    <Table.Tr>
                                        <Table.Td colSpan={5}>
                                            <Text fz="sm" c="dimmed">
                                                No roles found.
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                                {roles.map((role) => (
                                    <Table.Tr key={role.id}>
                                        <Table.Td>{role.name}</Table.Td>
                                        <Table.Td>{role.description || '-'}</Table.Td>
                                        <Table.Td>
                                            {role.permissions && role.permissions.length > 0 ? (
                                                <Group gap={4} wrap="wrap">
                                                    {role.permissions.map((perm) => (
                                                        <span
                                                            key={perm}
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                padding: '0.1rem 0.4rem',
                                                                borderRadius: '999px',
                                                                backgroundColor: '#e5e7eb',
                                                            }}
                                                        >
                                                            {perm}
                                                        </span>
                                                    ))}
                                                </Group>
                                            ) : (
                                                <Text fz="sm" c="dimmed">
                                                    None
                                                </Text>
                                            )}
                                        </Table.Td>
                                        <Table.Td>{role.isSystem ? 'Yes' : 'No'}</Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                {canUpdate && !role.isSystem && (
                                                    <Button
                                                        variant="subtle"
                                                        size="xs"
                                                        onClick={() => handleStartEdit(role)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                                {canDelete && !role.isSystem && (
                                                    <Button
                                                        variant="subtle"
                                                        color="red"
                                                        size="xs"
                                                        leftSection={<IconTrash size={14} />}
                                                        onClick={() => handleDelete(role)}
                                                        loading={saving}
                                                    >
                                                        Delete
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
                                Page {pagination.page} of {pagination.totalPages} · {pagination.total} roles
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
        </div>
    );
};

export default RolesPage;
