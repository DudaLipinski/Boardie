import { getInputClasses } from '@components/atoms/input'
import { HTMLProps, forwardRef, Ref } from 'react'

interface InputProps extends HTMLProps<HTMLInputElement> {
  label: string
}

export const Input = forwardRef(
  ({ label, ...rest }: InputProps, ref: Ref<HTMLInputElement>) => (
    <label className="relative mt-6 w-full">
      <input
        className={getInputClasses()}
        placeholder=" "
        {...rest}
        ref={ref}
      />
      <span className="absolute -top-5 left-0 px-2 text-xs duration-300 peer-placeholder-shown:left-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:-top-5 peer-focus:left-0 peer-focus:px-2 peer-focus:text-xs">
        {label}
      </span>
    </label>
  )
)
