import Head from "next/head";
import MemberForm from "@/components/MemberForm";
import MemberList from "@/components/MemberList";
import styles from "@/styles/Home.module.scss";

export default function Home() {
	return (
		<>
			<Head>
				<title>Banfan Guild Registration</title>
				<meta name="description" content="Guild member registration" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main__container}>
				<div className={styles.div__content}>
					<h1 className={styles.h1__title}>Welcome to Banfan Guild</h1>
					<p className={styles.p__description}>
						Please register your character below.
					</p>

					<MemberForm />
					<MemberList />
				</div>
			</main>
		</>
	);
}
