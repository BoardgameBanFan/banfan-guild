import { getXataClient } from "../../xata/xata";

const xata = getXataClient();

export const getMembers = async () => {
	const members = await xata.db.Member.getAll();
	// Filter out email for privacy - only return public information
	return members.map((member) => ({
		id: member.id,
		user_name: member.user_name,
		characters: member.characters,
		jobs: member.jobs,
		sub_jobs: member.sub_jobs,
		xata_createdat: member.xata_createdat,
		xata_updatedat: member.xata_updatedat,
	}));
};

export const getMemberByEmail = async (email) => {
	const member = await xata.db.Member.filter({
		mail: email,
	}).getFirst();

	if (!member) {
		return null;
	}

	// Return member data including email for the owner
	return {
		id: member.id,
		mail: member.mail,
		user_name: member.user_name,
		characters: member.characters,
		jobs: member.jobs,
		sub_jobs: member.sub_jobs,
	};
};

export const createOrUpdateMember = async ({
	email,
	name,
	character,
	jobs,
	sub_jobs,
}) => {
	// Check if member exists by email
	const existingMember = await xata.db.Member.filter({
		mail: email,
	}).getFirst();

	const memberData = {
		mail: email,
		user_name: name,
		characters: character ? [character] : [], // Store as array
		jobs: jobs || [],
		sub_jobs: sub_jobs || [],
	};

	if (existingMember) {
		// Update existing member using the record's update method
		return await existingMember.update(memberData);
	} else {
		// Create new member
		return await xata.db.Member.create(memberData);
	}
};
