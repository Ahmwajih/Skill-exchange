
"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";

const withAuth = (Component: ComponentType<any>) => {
  return (props: any) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/signin"); // Redirect to the sign-in page if not authenticated
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; // Optionally, you can return a loading spinner here
    }

    return <Component {...props} />;
  };
};

export default withAuth;


// 'use client';

// import { useAuth } from "@/hooks/useAuth";
// import SignIn from "../components/SignIn";
// import SignOut from "../components/SignOut";

// export default function Home() {
//   const { user, loading, error } = useAuth();

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div>
//       {user ? (
//         <>
//           <p>Welcome, {user.displayName}!</p>
//           <SignOut />
//         </>
//       ) : (
//         <SignIn />
//       )}
//     </div>
//   );
// }

// components/withAuth.tsx