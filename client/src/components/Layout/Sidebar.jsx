import React from 'react';

import { NavLink } from 'react-router-dom';

const Sidebar = ({ collapsed }) => {
    return (

        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">TM</div>
            <nav className="sidebar-nav">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'active' : ''}`
                    }
                >
                    <span className="sidebar-icon">🏠</span>
                    <span className="sidebar-label">Dashboard</span>
                </NavLink>

                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'active' : ''}`
                    }
                    >
                    <span className="sidebar-icon">👥</span>
                    <span className="sidebar-label">Users</span>
                </NavLink>

                <NavLink
                    to="/roles"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'active' : ''}`
                    }
                    >
                    <span className="sidebar-icon">🛡️</span>
                    <span className="sidebar-label">Roles</span>
                </NavLink>

                <NavLink
                    to="/sites"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'active' : ''}`
                    }
                    >
                    <span className="sidebar-icon">📍</span>
                    <span className="sidebar-label">Sites</span>
                </NavLink>

                {/* Todo links: Users, Roles, Sites */}
                {/* <NavLink to="/users" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}> ... */}
            </nav>
        </aside>
    );
};

export default Sidebar;
