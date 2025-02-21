// ...existing code...
export const getVariableExpenses = () => {
  return supabase
    .from('variable_expenses')
    .select(`
      amount,
      category:categories(name)
    `)
    .order('category.name', { ascending: true });
}
// ...existing code...
