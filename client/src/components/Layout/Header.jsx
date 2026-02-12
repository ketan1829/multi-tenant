import React from 'react';

import { Group, Button, Text, Avatar } from '@mantine/core';

import useAuth from '../../hooks/useAuth.js';

const Header = ({ onToggleSidebar }) => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <Group justify="space-between" w="100%">
                <Group gap="sm">
                    <button type="button" className="burger-btn" onClick={onToggleSidebar}>
                        ☰
                    </button>
                    <div>
                        <Text fw={600} size="sm">
                            Tenant Management
                        </Text>
                        <Text size="xs" c="dimmed">
                            Admin console
                        </Text>
                    </div>
                </Group>
                <Group gap="sm">
                    {user && (
                        <Group gap={6}>
                            <Avatar size={26} radius="xl">
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <div>
                                <Text size="sm" fw={500}>
                                    {user.name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {user.roleName || 'User'}
                                </Text>
                            </div>
                        </Group>
                    )}
                    <Button variant="outline" size="xs" color="gray" onClick={logout}>
                        Logout
                    </Button>
                </Group>
            </Group>
        </header>
    );
};

export default Header;
