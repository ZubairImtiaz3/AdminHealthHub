import React from 'react';

const Page = ({ params }: { params: { adminsId: string } }) => {
  return <div>{params.adminsId}</div>;
};

export default Page;
