import React from 'react';
import { useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import { NavLink, Stack, Text, Group } from '@mantine/core';
import {
  IconLayoutDashboard,
  IconUsers,
  IconShieldLock,
  IconBuildingEstate,
} from '@tabler/icons-react';

const Sidebar = ({ collapsed }) => {
  const location = useLocation();

  const links = [
    {
      label: 'Dashboard',
      to: '/',
      icon: IconLayoutDashboard,
    },
    {
      label: 'Users',
      to: '/users',
      icon: IconUsers,
    },
    {
      label: 'Roles',
      to: '/roles',
      icon: IconShieldLock,
    },
    {
      label: 'Sites',
      to: '/sites',
      icon: IconBuildingEstate,
    },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Group justify={collapsed ? 'center' : 'flex-start'} gap="xs">
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background:
                'radial-gradient(circle at 30% 30%, #3b82f6 0, #1e3a8a 60%, #0f172a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            MT
          </div>
          {!collapsed && (
            <Text size="sm" fw={600}>
              Multi Tenant
            </Text>
          )}
        </Group>
      </div>

      <nav className="sidebar-nav">
        <Stack gap={4}>
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to);

            return (
              <NavLink
                key={link.to}
                component={RouterNavLink}
                to={link.to}
                label={!collapsed ? link.label : null}
                leftSection={<Icon size={18} stroke={1.7} />}
                active={active}
                variant={active ? 'light' : 'subtle'}
                style={(theme) => ({
                    borderRadius: 8,
                    paddingInline: collapsed ? 8 : 10,
                    color: active ? '#e5e7eb' : '#9ca3af',          
                    '&:hover': {
                      backgroundColor: active
                        ? 'rgba(37, 99, 235, 0.18)'               
                        : 'rgba(31, 41, 55, 0.9)',
                      color: '#e5e7eb',                           
                    },
                  })}
                className="mantine-sidebar-link"
              />
            );
          })}
        </Stack>
      </nav>
    </aside>
  );
};

export default Sidebar;
