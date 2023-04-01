import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Settle-up!</title>
        <meta name="description" content="Discord Accountant Bot Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <h1>Booking done right</h1>
        <section>
          <h2>Features:</h2>
          <ul>
            <li>Keep track of who and what you owe</li>
            <li>Pay in your own time</li>
            <li>Avoid tedious, tiny transactions</li>
            <li>Automatically control</li>
          </ul>
        </section>
        <Link href="/">Invite to your discord server</Link>
      </main>
    </>
  );
};

export default Home;
