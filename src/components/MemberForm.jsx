import { useState } from "react";
import Select from "react-select";
import useSWR, { mutate } from "swr";
import styles from "./MemberForm.module.scss";

export const JOB_OPTIONS = [
	// --- Tank (防護職業) ---
	{ value: "Gladiator", label: "劍術師" }, // 基礎職業
	{ value: "Marauder", label: "斧術師" }, // 基礎職業
	{ value: "Paladin", label: "騎士" },
	{ value: "Warrior", label: "戰士" },
	{ value: "Dark Knight", label: "暗黑騎士" },
	{ value: "Gunbreaker", label: "絕槍戰士" },

	// --- Healer (治療職業) ---
	{ value: "Conjurer", label: "幻術師" }, // 基礎職業
	{ value: "White Mage", label: "白魔道士" },
	{ value: "Scholar", label: "學者" },
	{ value: "Astrologian", label: "占星術士" },
	{ value: "Sage", label: "賢者" },

	// --- Melee DPS (近戰物理) ---
	{ value: "Pugilist", label: "格鬥師" }, // 基礎職業
	{ value: "Lancer", label: "槍術師" }, // 基礎職業
	{ value: "Rogue", label: "雙劍師" }, // 基礎職業 (2.4追加)
	{ value: "Monk", label: "武僧" },
	{ value: "Dragoon", label: "龍騎士" },
	{ value: "Ninja", label: "忍者" },
	{ value: "Samurai", label: "武士" },
	{ value: "Reaper", label: "釤鐮客" },
	{ value: "Viper", label: "蛇武" },

	// --- Physical Ranged DPS (遠程物理) ---
	{ value: "Archer", label: "弓箭手" }, // 基礎職業
	{ value: "Bard", label: "吟遊詩人" },
	{ value: "Machinist", label: "機工士" },
	{ value: "Dancer", label: "舞者" },

	// --- Magical Ranged DPS (遠程魔法) ---
	{ value: "Thaumaturge", label: "咒術師" }, // 基礎職業
	{ value: "Arcanist", label: "秘術師" }, // 基礎職業 (可轉召喚或學者)
	{ value: "Black Mage", label: "黑魔道士" },
	{ value: "Summoner", label: "召喚師" },
	{ value: "Red Mage", label: "赤魔道士" },
	{ value: "Pictomancer", label: "繪靈法師" },

	// --- Limited (設限特職) ---
	{ value: "Blue Mage", label: "青魔道士" },
];

export const CRAFTING_GATHERING_OPTIONS = [
	// --- Disciples of the Hand (能工巧匠 / 製作職業) ---
	{ value: "Carpenter", label: "木工師" },
	{ value: "Blacksmith", label: "鍛鐵師" },
	{ value: "Armorer", label: "鑄甲師" },
	{ value: "Goldsmith", label: "雕金師" },
	{ value: "Leatherworker", label: "製革師" },
	{ value: "Weaver", label: "裁衣師" },
	{ value: "Alchemist", label: "鍊金術士" },
	{ value: "Culinarian", label: "烹調師" },

	// --- Disciples of the Land (大地使者 / 採集職業) ---
	{ value: "Miner", label: "採礦工" },
	{ value: "Botanist", label: "園藝工" },
	{ value: "Fisher", label: "捕魚人" },
];

export default function MemberForm() {
	const [step, setStep] = useState(1); // 1: email input, 2: full form
	const [formData, setFormData] = useState({
		email: "",
		name: "",
		character: "",
		jobs: [],
		sub_jobs: [],
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCheckingEmail, setIsCheckingEmail] = useState(false);
	const [message, setMessage] = useState("");

	const handleEmailCheck = async (e) => {
		e.preventDefault();
		setIsCheckingEmail(true);
		setMessage("");

		try {
			// Check if member exists by email
			const res = await fetch(
				`/api/data/member?email=${encodeURIComponent(formData.email)}`,
			);

			if (res.status === 404) {
				// Member not found, show empty form
				setStep(2);
				setMessage("新使用者，請填寫資料");
			} else if (res.ok) {
				// Member found, load existing data
				const member = await res.json();
				setFormData({
					email: member.mail,
					name: member.user_name || "",
					character: member.characters?.[0] || "",
					jobs: (member.jobs || [])
						.map((job) => JOB_OPTIONS.find((option) => option.value === job))
						.filter(Boolean),
					sub_jobs: (member.sub_jobs || [])
						.map((job) =>
							CRAFTING_GATHERING_OPTIONS.find((option) => option.value === job),
						)
						.filter(Boolean),
				});
				setStep(2);
				setMessage("找到現有資料，可以更新");
			} else {
				throw new Error("Failed to check email");
			}
		} catch (error) {
			console.error(error);
			setMessage("檢查 email 時發生錯誤");
		} finally {
			setIsCheckingEmail(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setMessage("");

		try {
			const res = await fetch("/api/data/member", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					jobs: formData.jobs.map((job) => job.value), // Send array of strings
					sub_jobs: formData.sub_jobs.map((job) => job.value), // Send array of strings
				}),
			});

			if (!res.ok) {
				throw new Error("Registration failed");
			}

			setMessage("註冊/更新成功！");
			setFormData({
				email: "",
				name: "",
				character: "",
				jobs: [],
				sub_jobs: [],
			});
			setStep(1); // Reset to step 1
			mutate("/api/data/member"); // Refresh the list
		} catch (error) {
			console.error(error);
			setMessage("Error submitting form.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={styles.form__container}>
			<h2 className={styles.h2__title}>Member Registration</h2>

			{step === 1 ? (
				// Step 1: Email input only
				<form onSubmit={handleEmailCheck}>
					<div className={styles.div__field}>
						<label htmlFor="email">Email (ID)</label>
						<input
							id="email"
							type="email"
							required
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							className={styles.input__field}
							placeholder="資料更新的唯一識別（不會外流，也不該被其他人知道）"
							disabled={isCheckingEmail}
						/>
					</div>

					<button
						type="submit"
						disabled={isCheckingEmail}
						className={styles.button__submit}
					>
						{isCheckingEmail ? "檢查中..." : "確認 Email"}
					</button>

					{message && <p className={styles.p__message}>{message}</p>}
				</form>
			) : (
				// Step 2: Full form
				<form onSubmit={handleSubmit}>
					<div className={styles.div__field}>
						<label htmlFor="email">Email (ID)</label>
						<input
							id="email"
							type="email"
							required
							value={formData.email}
							className={styles.input__field}
							disabled
							style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
						/>
					</div>

					<div className={styles.div__field}>
						<label htmlFor="name">User Name</label>
						<input
							id="name"
							type="text"
							required
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							className={styles.input__field}
							placeholder="你的 Discord 名稱（只是讓大家知道是誰）"
						/>
					</div>

					<div className={styles.div__field}>
						<label htmlFor="character">Character Name</label>
						<input
							id="character"
							type="text"
							required
							value={formData.character}
							onChange={(e) =>
								setFormData({ ...formData, character: e.target.value })
							}
							className={styles.input__field}
							placeholder="遊戲角色名稱（給大家加好友用）"
						/>
					</div>

					<div className={styles.div__field}>
						<label htmlFor="jobs-select">Class & Jobs</label>
						<Select
							isMulti
							options={JOB_OPTIONS}
							value={formData.jobs}
							onChange={(selected) =>
								setFormData({ ...formData, jobs: selected || [] })
							}
							className={styles.select__field}
							classNamePrefix="react-select"
							inputId="jobs-select"
						/>
					</div>

					<div className={styles.div__field}>
						<label htmlFor="sub-jobs-select">
							生產系職業 (Crafting & Gathering)
						</label>
						<Select
							isMulti
							options={CRAFTING_GATHERING_OPTIONS}
							value={formData.sub_jobs}
							onChange={(selected) =>
								setFormData({ ...formData, sub_jobs: selected || [] })
							}
							className={styles.select__field}
							classNamePrefix="react-select"
							inputId="sub-jobs-select"
							placeholder="選擇生產採集職業..."
						/>
					</div>

					<div style={{ display: "flex", gap: "1rem" }}>
						<button
							type="button"
							onClick={() => {
								setStep(1);
								setFormData({
									email: "",
									name: "",
									character: "",
									jobs: [],
									sub_jobs: [],
								});
								setMessage("");
							}}
							className={styles.button__submit}
							style={{ backgroundColor: "#666" }}
						>
							返回
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className={styles.button__submit}
						>
							{isSubmitting ? "提交中..." : "提交"}
						</button>
					</div>

					{message && <p className={styles.p__message}>{message}</p>}
				</form>
			)}
		</div>
	);
}
