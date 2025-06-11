import React from 'react';
import { SYSTEM_COMPONENTS_DATA } from '../constants';
import ComponentCard from './ComponentCard';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-text-dark-primary mb-6">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SYSTEM_COMPONENTS_DATA.map(component => (
          <ComponentCard key={component.id} component={component} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
