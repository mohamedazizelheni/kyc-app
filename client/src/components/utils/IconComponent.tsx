import React from 'react';
import { IconType } from 'react-icons';

interface IconProps {
  icon: IconType;
}

const IconComponent: React.FC<IconProps> = ({ icon: Icon }) => {
  const Component = Icon as React.ComponentType<any>;
  return <Component />;
};

export default IconComponent;
