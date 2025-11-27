import {
	getMembers,
	getMemberByEmail,
	createOrUpdateMember,
} from "@/server/xata/members";

export default async function handler(req, res) {
	if (req.method === "GET") {
		const { email } = req.query;

		// If email is provided, get specific member
		if (email) {
			try {
				const member = await getMemberByEmail(email);
				if (!member) {
					return res.status(404).json({ error: "Member not found" });
				}
				res.status(200).json(member);
			} catch (error) {
				console.error("Error fetching member by email:", error);
				res.status(500).json({ error: "Failed to fetch member" });
			}
		} else {
			// Get all members
			try {
				const members = await getMembers();
				res.status(200).json(members);
			} catch (error) {
				console.error("Error fetching members:", error);
				res.status(500).json({ error: "Failed to fetch members" });
			}
		}
	} else if (req.method === "POST") {
		try {
			const { email, name, character, jobs, sub_jobs } = req.body;

			if (!email) {
				return res.status(400).json({ error: "Email is required" });
			}

			const result = await createOrUpdateMember({
				email,
				name,
				character,
				jobs,
				sub_jobs,
			});
			res.status(200).json(result);
		} catch (error) {
			console.error("Error registering member:", error);
			res.status(500).json({ error: "Failed to register member" });
		}
	} else {
		res.setHeader("Allow", ["GET", "POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
