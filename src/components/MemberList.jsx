import useSWR from "swr";
import styles from "./MemberList.module.scss";
import { JOB_OPTIONS, CRAFTING_GATHERING_OPTIONS } from "./MemberForm.jsx";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MemberList() {
	const { data: members, error } = useSWR("/api/data/member", fetcher);

	if (error)
		return <div className={styles.div__error}>Failed to load members</div>;
	if (!members) return <div className={styles.div__loading}>Loading...</div>;

	return (
		<div className={styles.div__container}>
			<h2 className={styles.h2__title}>Guild Members</h2>
			<div className={styles.div__grid}>
				{members.map((member) => (
					<div key={member.id} className={styles.div__card}>
						<div className={styles.div__header}>
							<h3 className={styles.h3__name}>
								{member.user_name || "Unknown"}
							</h3>
						</div>
						<div className={styles.div__details}>
							<p>
								<strong>Character:</strong>{" "}
								{member.characters?.join(", ") || "None"}
							</p>
							<p>
								<strong>Jobs:</strong>
							</p>
							<div className={styles.div__tags}>
								{member.jobs?.map((job) => (
									<span key={job} className={styles.span__tag}>
										{JOB_OPTIONS.find((option) => option.value === job)
											?.label || job}
									</span>
								))}
							</div>
							<p>
								<strong>生產採集職業:</strong>
							</p>
							<div className={styles.div__tags}>
								{member.sub_jobs?.length > 0 ? (
									member.sub_jobs.map((job) => (
										<span key={job} className={styles.span__tag}>
											{CRAFTING_GATHERING_OPTIONS.find(
												(option) => option.value === job,
											)?.label || job}
										</span>
									))
								) : (
									<span className={styles.span__tag}>無</span>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
