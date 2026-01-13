import { Globe } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/ui/components/base/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/components/base/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/components/base/tooltip"

const languages = [
  { value: "en", label: "English", short: "EN" },
  { value: "id", label: "Bahasa Indonesia", short: "ID" },
]

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language ?? "en").split("-")[0]
  const activeLanguage = languages.find((lang) => lang.value === currentLanguage) ?? languages[0]

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hidden h-8 px-2 lg:inline-flex"
            >
              <Globe className="size-4" />
              <span className="text-xs font-semibold tracking-wide">{activeLanguage.short}</span>
              <span className="sr-only">{t("console.language.switch")}</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("console.language.switch")}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel>{t("console.language.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={activeLanguage.value}
          onValueChange={(value) => {
            void i18n.changeLanguage(value)
          }}
        >
          {languages.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="justify-between"
            >
              <span>{option.label}</span>
              <span className="text-muted-foreground ml-auto text-xs">{option.short}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
