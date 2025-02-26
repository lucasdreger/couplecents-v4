import { json } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const GET = async (event) => {
	const { params } = event;
	const { session, supabaseClient } = await getSupabase(event);
	
	if (!session) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
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
	
	// Fetch household details
	const { data: household, error: householdError } = await supabaseClient
		.from('households')
		.select('*')
		.eq('id', householdId)
		.single();
		
	if (householdError || !household) {
		return json({ error: 'Household not found' }, { status: 404 });
	}
	
	return json({ household });
};
