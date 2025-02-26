<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	
	export let data: PageData;
	const toastStore = getToastStore();
	
	let loading = false;
	let joinedHousehold: any = null;
	let householdMembers: any[] = [];

	async function loadHouseholdDetails(householdId: string) {
		try {
			const response = await fetch(`/api/household/${householdId}`);
			if (response.ok) {
				const data = await response.json();
				joinedHousehold = data.household;
				
				// Fetch members
				const membersResponse = await fetch(`/api/household/${householdId}/members`);
				if (membersResponse.ok) {
					const membersData = await membersResponse.json();
					householdMembers = membersData.members || [];
				}
			}
		} catch (error) {
			console.error('Error fetching household details:', error);
		}
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="h1 mb-4">Join a Household</h1>

	{#if joinedHousehold}
		<div class="card p-4 mb-4 variant-filled-success">
			<h2 class="h2">Successfully joined household!</h2>
			<p class="text-lg my-2">You now belong to household: <strong>{joinedHousehold.name}</strong></p>
			
			<h3 class="h3 mt-4">Household members:</h3>
			<ul class="list">
				{#each householdMembers as member}
					<li class="p-2">{member.name || member.email || 'Unknown member'}</li>
				{:else}
					<li class="p-2">No other members found</li>
				{/each}
			</ul>
			
			<div class="flex justify-between mt-4">
				<a href="/household" class="btn variant-filled">Go to Households</a>
				<button class="btn variant-ghost" on:click={() => {joinedHousehold = null; householdMembers = [];}}>Join Another</button>
			</div>
		</div>
	{:else}
		<form
			method="POST"
			action="?/join"
			use:enhance={() => {
				loading = true;
				
				return async ({ result }) => {
					loading = false;
					
					if (result.type === 'success') {
						toastStore.trigger({
							message: 'Successfully joined household!',
							background: 'variant-filled-success'
						});
						
						// If we have the household ID in the result
						if (result.data?.householdId) {
							await loadHouseholdDetails(result.data.householdId);
						}
					} else if (result.type === 'failure') {
						toastStore.trigger({
							message: result.data?.message || 'Failed to join household',
							background: 'variant-filled-error'
						});
					}
				};
			}}
		>
			<div class="form-control">
				<label class="label" for="code">
					<span>Household Invite Code</span>
				</label>
				<input
					class="input"
					name="code"
					id="code"
					type="text"
					placeholder="Enter invite code"
					required
				/>
			</div>

			<button disabled={loading} type="submit" class="btn variant-filled-primary mt-4">
				{#if loading}Joining...{:else}Join Household{/if}
			</button>
		</form>

		{#if $page.form?.error}
			<p class="text-error-500 mt-2">{$page.form.error}</p>
		{/if}
	{/if}
</div>
