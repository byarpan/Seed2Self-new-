import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import SharedRoleDashboard from "@/components/roles/SharedRoleDashboard";

export default function DistributorPage({ user }: { user: any }) {
  return <SharedRoleDashboard user={user} role="Distributor" />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session || session.user?.role !== "DISTRIBUTOR") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { user: session.user } };
};
