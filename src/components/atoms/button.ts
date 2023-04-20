import { Size, Variant } from '@src/types/Theme'

type ButtonStyles = Record<Variant, (size: Size) => string>

const variantStyles: ButtonStyles = {
  solid: (size) =>
    `duration-400 rounded-lg p-2 text-gray-950 transition-color bg-pink-400 hover:bg-pink-300 ${
      size === 'sm' ? 'text-sm' : size === 'md' ? 'text-md' : 'w-full'
    }`,
  outlined: (size) =>
    `duration-400 rounded-lg p-2 text-pink-400 transition-colors border border-pink-400 border-pink-400 hover:border-pink-300 hover:text-pink-300 ${
      size === 'sm' ? 'text-sm' : size === 'md' ? 'text-md' : 'w-full'
    }`,
}

export const getButtonClasses = (
  {
    variant,
    size,
  }: {
    variant: Variant
    size: Size
  } = { variant: 'solid', size: 'lg' }
): string => {
  return variantStyles[variant](size)
}
