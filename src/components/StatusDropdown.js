import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { STATUS_OPTIONS } from '../utils/constants'; // Importamos las constantes de estados

const { Option } = Select;

const StatusDropdown = ({ status, onStatusChange }) => {
  // Aseguramos que el status tenga un valor predeterminado si es null o undefined
  const [selectedStatus, setSelectedStatus] = useState(status || 'N/A');

  useEffect(() => {
    // Si el status cambia desde el exterior, actualiza el estado local
    if (status !== selectedStatus) {
      setSelectedStatus(status || 'N/A');
    }
  }, [status]);

  const handleChange = (newStatus) => {
    setSelectedStatus(newStatus); // Actualizamos el estado local
    onStatusChange(newStatus);    // Propagamos el cambio hacia el componente padre
  };

  return (
    <Select
      value={selectedStatus}
      style={{ width: 120 }}
      onChange={handleChange}
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
