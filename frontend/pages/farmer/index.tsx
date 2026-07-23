import Head from "next/head";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps } from "next";

export default function FarmerHome() {
  return (
    <div className="h-full w-full relative">
      <Head>
        <title>Seed2Shelf - Farmer Portal</title>
      </Head>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (session?.user) {
      return { props: { user: JSON.parse(JSON.stringify(session.user)) } };
    }
  } catch (err) {
    console.error("Session fetch error:", err);
  }
  return {
    props: {
      user: {
        id: "demo-farmer-id",
        name: "Demo Farmer",
        role: "FARMER",
        farmerId: "S2S-FRM-000001"
      }
    }
  };
};
