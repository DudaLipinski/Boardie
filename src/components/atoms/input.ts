export const getInputClasses = (
  { size }: { size: 'sm' | 'md' | 'lg' } = { size: 'lg' }
) =>
  'w-full rounded-lg border-gray-600 bg-gray-900 p-3 text-white focus:outline-none focus:ring-1 focus:invalid:border-pink-400 focus:invalid:ring-pink-400'
