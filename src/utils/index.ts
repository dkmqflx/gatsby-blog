export const parseQuery = (query: string) => {
  const [_, category] = query.replace('?', '').split('=')

  return category ? category : 'All'
}
