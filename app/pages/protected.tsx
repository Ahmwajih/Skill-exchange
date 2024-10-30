// pages/protected.tsx
import { withAuth } from '@/hoc/withAuth';

function ProtectedPage() {
  return <div>This is a protected page</div>;
}

export default withAuth(ProtectedPage);