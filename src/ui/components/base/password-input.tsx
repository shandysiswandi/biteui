import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group"

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  defaultVisible?: boolean
  groupClassName?: string
  showLabel?: string
  hideLabel?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      defaultVisible = false,
      disabled,
      groupClassName,
      hideLabel = "Hide password",
      showLabel = "Show password",
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = React.useState(defaultVisible)
    const toggleLabel = isVisible ? hideLabel : showLabel

    return (
      <InputGroup data-disabled={disabled ? true : undefined} className={groupClassName}>
        <InputGroupInput
          ref={ref}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          className={className}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-sm"
            aria-pressed={isVisible}
            disabled={disabled}
            onClick={() => setIsVisible((value) => !value)}
          >
            {isVisible ? <Eye /> : <EyeOff />}
            <span className="sr-only">{toggleLabel}</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    )
  },
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
