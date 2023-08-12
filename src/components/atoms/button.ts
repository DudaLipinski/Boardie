import { Color, Size, Variant } from '@src/types/Theme'

type ButtonStyles = Record<Variant, (size: Size, color: Color) => string>

const variantStyles: ButtonStyles = {
  solid: (size, color) => `
    duration-400 rounded-lg p-2 text-gray-950 transition-colors
    bg-${color}-400 hover:bg-${color}-300

    ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-md' : 'w-full'}
  `,
  outlined: (size, color) => `
    duration-400 rounded-lg p-2 text-${color}-400 transition-colors
    border border-${color}-400 hover:border-${color}-300 hover:text-${color}-300

    ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-md' : 'w-full'}
  `,
}

export const getButtonClasses = ({
  variant,
  size,
  color,
}: {
  variant: Variant
  size: Size
  color: Color
}): string => {
  return variantStyles[variant](size, color)
}
