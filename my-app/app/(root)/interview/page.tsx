import React from 'react';
import Agent from '@/components/Agent';

const Page = () => {
  return (
    <>
      <h3 className="text-xl font-semibold mb-4">
        Interview Generation
      </h3>

      <Agent userName="You" />
    </>
  );
};

export default Page;
