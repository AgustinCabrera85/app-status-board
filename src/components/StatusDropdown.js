import React from 'react';
import { Select } from 'antd';
import { STATUS_OPTIONS } from '../utils/constants'; // Importamos las constantes de estados

const { Option } = Select;

const StatusDropdown = ({ status, onStatusChange }) => {
    return (
        <Select
        value={status || 'N/A'}
        style={{ width: 120 }}
        onChange={(newStatus) => onStatusChange(newStatus)}
        >
        {STATUS_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
            {option.label}
            </Option>
        ))}
        </Select>
    );
};

export default StatusDropdown;
