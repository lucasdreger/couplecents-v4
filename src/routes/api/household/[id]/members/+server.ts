import { json } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const GET = async (event) => {
	const { params } = event;
	const { session, supabaseClient } = await getSupabase(event);
	
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	
	const householdId = params.id;
	
	// Verify user belongs to this household
	const { data: membership, error: membershipError } = await supabaseClient
		.from('users_households')
		.select('*')
		.eq('user_id', session.user.id)
		.eq('household_id', householdId)
		.maybeSingle();
		
	if (membershipError || !membership) {
		return json({ error: 'You do not have access to this household' }, { status: 403 });
	}
	
	// Fetch all users belonging to the household with their profile information
	const { data: members, error: membersError } = await supabaseClient
		.from('users_households')
		.select(`
			household_id,
			users (
				id,
				email,
				user_metadata
			)
		`)
		.eq('household_id', householdId);
		
	if (membersError) {
		return json({ error: 'Failed to fetch household members' }, { status: 500 });
	}
	
	// Process members to extract user details and format names
	const formattedMembers = members.map(member => {
		const user = member.users;
		const metadata = user.user_metadata || {};
		return {
			id: user.id,
			email: user.email,
			name: metadata.name || metadata.full_name || user.email.split('@')[0]
		};
	});
	
	return json({ members: formattedMembers });
};
