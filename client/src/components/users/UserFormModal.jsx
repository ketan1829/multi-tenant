import React, { useEffect, useState } from 'react';

import {
    Modal,
    TextInput,
    PasswordInput,
    Select,
    Group,
    Button,
    Stack,
    Text,
} from '@mantine/core';

import { useForm, isNotEmpty, isEmail } from '@mantine/form';

import rolesApi from '../../api/roles.api.js';
import sitesApi from '../../api/sites.api.js';

const UserFormModal = ({ opened, onClose, onSubmit, initialUser, submitting }) => {
    const isEdit = Boolean(initialUser?.id);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: initialUser?.name || '',
            email: initialUser?.email || '',
            password: '',
            roleId: initialUser?.role?.id || '',
            siteId: initialUser?.site?.id || '',
            status: initialUser?.status || 'active',
        },
        validate: {
            name: isNotEmpty('Name is required'),
            email: isEmail('Invalid email'),
            roleId: isNotEmpty('Role is required'),
        },
    });

    const [rolesOptions, setRolesOptions] = useState([]);
    const [sitesOptions, setSitesOptions] = useState([]);
    const [loadingLookups, setLoadingLookups] = useState(false);
    const [lookupError, setLookupError] = useState('');

    const loadLookups = async () => {
        setLoadingLookups(true);
        setLookupError('');
        try {
            const [roles, sites] = await Promise.all([
                rolesApi.getAllRoles(),
                sitesApi.getAllSites(),
            ]);

            setRolesOptions(
                roles.map((r) => ({
                    value: r.id,
                    label: r.name,
                }))
            );

            setSitesOptions(
                sites.map((s) => ({
                    value: s.id,
                    label: s.name,
                }))
            );
        } catch (err) {
            const message =
                err.response?.data?.message || 'Failed to load roles/sites';
            setLookupError(message);
        } finally {
            setLoadingLookups(false);
        }
    };

    useEffect(() => {
        if (opened) {
            loadLookups();
            form.setValues({
                name: initialUser?.name || '',
                email: initialUser?.email || '',
                password: '',
                roleId: initialUser?.role?.id || '',
                siteId: initialUser?.site?.id || '',
                status: initialUser?.status || 'active',
            });
            form.resetDirty();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened, initialUser]);

    const handleSubmit = form.onSubmit((values) => {
        const payload = {
            name: values.name.trim(),
            email: values.email.trim(),
            role: values.roleId,
            site: values.siteId || null,
            status: values.status,
        };

        if (!isEdit || values.password.trim()) {
            payload.password = values.password.trim();
        }

        onSubmit(payload);
    });

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={isEdit ? 'Edit user' : 'Create user'}
            centered
            size="lg"
            radius="lg"
        >
            <form onSubmit={handleSubmit}>
                <Stack gap="sm">
                    <Group grow align="flex-start">
                        <TextInput
                            label="Name"
                            placeholder="Full name"
                            key={form.key('name')}
                            {...form.getInputProps('name')}
                            size="sm"
                        />
                        <TextInput
                            label="Email"
                            placeholder="name@example.com"
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                            size="sm"
                        />
                    </Group>
                    <Group grow align="flex-start">
                        <PasswordInput
                            label={isEdit ? 'Password (leave blank to keep unchanged)' : 'Password'}
                            placeholder="Minimum 6 characters"
                            key={form.key('password')}
                            {...form.getInputProps('password')}
                            size="sm"
                        />
                    </Group>
                    <Group grow align="flex-start">
                        <Select
                            label="Role"
                            placeholder={loadingLookups ? 'Loading roles...' : 'Select role'}
                            data={rolesOptions}
                            key={form.key('roleId')}
                            {...form.getInputProps('roleId')}
                            searchable
                            size="sm"
                        />
                        <Select
                            label="Site"
                            placeholder={loadingLookups ? 'Loading sites...' : 'Optional site'}
                            data={sitesOptions}
                            key={form.key('siteId')}
                            {...form.getInputProps('siteId')}
                            searchable
                            clearable
                            size="sm"
                        />
                    </Group>
                    <Select
                        label="Status"
                        data={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                        ]}
                        key={form.key('status')}
                        {...form.getInputProps('status')}
                        size="sm"
                    />
                    {lookupError && (
                        <Text c="red" fz="sm">
                            {lookupError}
                        </Text>
                    )}
                    <Group justify="flex-end" mt="sm">
                        <Button variant="subtle" color="gray" onClick={onClose} size="sm" type="button">
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" loading={submitting}>
                            {isEdit ? 'Save changes' : 'Create user'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};

export default UserFormModal;
