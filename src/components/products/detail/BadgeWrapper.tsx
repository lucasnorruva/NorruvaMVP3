import React from 'react';
import { Badge, BadgeProps } from '../../ui/badge'; // Assuming BadgeProps are exported

interface BadgeWrapperProps extends BadgeProps {
  // Add any additional props if needed, otherwise just extend BadgeProps
}

const BadgeWrapper: React.FC<BadgeWrapperProps> = (props) => {
  return <Badge {...props} />;
};

export default BadgeWrapper;