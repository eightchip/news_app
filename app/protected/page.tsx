'use client';
import withAuth from '../../app/lib/withAuth';

const Protected = () => {
  return (
    <div>
      <h1>Protected Page</h1>
      <p>If you see this, you are authenticated.</p>
    </div>
  );
};

export default withAuth(Protected);
