import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import SharedRoleDashboard from "@/components/roles/SharedRoleDashboard";

export default function ProcessorPage({ user }: { user: any }) {
  return <SharedRoleDashboard user={user} role="Processor" />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session || session.user?.role !== "PROCESSOR") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { user: session.user } };
};
