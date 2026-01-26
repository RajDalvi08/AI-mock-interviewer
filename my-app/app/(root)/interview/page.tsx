import React from 'react';
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.actions';

interface PageProps {
  user: {
    name: string;
    id: string;
  } | null;
}

const Page = ({ user }: PageProps) => {
  if (!user) {
    return <div>Loading...</div>; // Optionally handle loading state or redirect if no user
  }

  return (
    <>
      <h3 className="text-xl font-semibold mb-4">Interview Generation</h3>
      {/* Pass the user details as props to the Agent component */}
      <Agent userName={user.name} userId={user.id} interviewId="dummyId" feedbackId="dummyFeedbackId" type="generate" />
    </>
  );
};

// Fetch user data server-side before rendering the page
export async function getServerSideProps() {
  const user = await getCurrentUser();

  return {
    props: {
      user,
    },
  };
}

export default Page;
