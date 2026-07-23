import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import SharedRoleDashboard from "@/components/roles/SharedRoleDashboard";

export default function RetailerPage({ user }: { user: any }) {
  return <SharedRoleDashboard user={user} role="Retailer" />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session || session.user?.role !== "RETAILER") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { user: session.user } };
};
