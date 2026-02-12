import React from 'react';

import { Text } from '@mantine/core';

const StatusPill = ({ status }) => {
    const normalized = (status || '').toLowerCase();
    const isActive = normalized === 'active';

    const bg = isActive ? '#dcfce7' : '#e5e7eb';
    const color = isActive ? '#16a34a' : '#4b5563';

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.1rem 0.5rem',
                borderRadius: '999px',
                backgroundColor: bg,
            }}
        >
            <Text size="xs" fw={500} c={color}>
                {status}
            </Text>
        </span>
    );
};

export default StatusPill;
