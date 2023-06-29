import { Audit } from "@/components/Audit";
import { CustomMap } from "@/components/Map";
import { NavBar } from "@/components/NavBar";
import { NodeStatus } from "@/components/NodeStatus";
import { signIn, useSession } from "next-auth/react";
import { cookies } from "next/headers";

const isAutenticated = (): boolean => {
  return true;
};

export default function Index() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        <NavBar></NavBar>
        <div className="flex flex-row">
          <div className="basis-3/4">
            <CustomMap></CustomMap>
          </div>
          <div className="basis-1/4">
            <div className="flex flex-col">
              <NodeStatus></NodeStatus>
              <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-80" />
              <Audit></Audit>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          className="w-8 h-8 mr-2"
          src="/favicon.ico"
          alt="logo"
        />
        OCPP Monitoring
      </a>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            You are not logged in
          </h1>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={() => signIn()}>Sign in</button>
        </div>
      </div>
    </div>
  </section>
  );
}
