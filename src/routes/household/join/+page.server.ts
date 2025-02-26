import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const actions: Actions = {
	join: async (event) => {
		const { request } = event;
		const { session, supabaseClient } = await getSupabase(event);
		if (!session) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const code = formData.get('code')?.toString();

		if (!code) {
			return fail(400, { error: 'Invite code is required' });
		}

		// Check if invite code exists
		const { data: household, error: householdError } = await supabaseClient
			.from('households')
			.select('id, name')
			.eq('invite_code', code)
			.single();

		if (householdError || !household) {
			return fail(400, { error: 'Invalid invite code' });
		}

		// Check if user is already a member
		const { data: existingMembership, error: membershipError } = await supabaseClient
			.from('users_households')
			.select('*')
			.eq('user_id', session.user.id)
			.eq('household_id', household.id)
			.maybeSingle();

		if (existingMembership) {
			return fail(400, { error: 'You are already a member of this household' });
		}

		// Add user to household
		const { error: joinError } = await supabaseClient
			.from('users_households')
			.insert({ user_id: session.user.id, household_id: household.id });

		if (joinError) {
			console.error('Error joining household:', joinError);
			return fail(500, { error: 'Failed to join household' });
		}

		// Return success with household ID instead of redirecting
		return {
			status: 200,
			householdId: household.id
		};
	}
};
