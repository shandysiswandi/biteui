import { useState } from "react"
import { toast } from "sonner"

import { notifyApiError } from "@/lib/utils/notify"

import type { BackupCodeOutput } from "../model/mfa"
import { useBackupCodeMutation } from "../queries/use-backup-code-mutation"

const backupCodesPreview = Array.from({ length: 10 }, () => "XXXX-XXXX-XXXX")

type UseBackupCodesOptions = {
  isBackupCodeEnabled: boolean
}

export function useBackupCodes({ isBackupCodeEnabled }: UseBackupCodesOptions) {
  const backupCodeMutation = useBackupCodeMutation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [backupPassword, setBackupPassword] = useState("")
  const [backupCodes, setBackupCodes] = useState<BackupCodeOutput | null>(null)
  const [showBackupPasswordForm, setShowBackupPasswordForm] = useState(false)

  const isBackupViewOnly = isBackupCodeEnabled && !backupCodes

  const resetBackupDialogState = () => {
    setBackupPassword("")
    setBackupCodes(null)
    setShowBackupPasswordForm(false)
  }

  const handleBackupDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetBackupDialogState()
      return
    }
    resetBackupDialogState()
  }

  const handleGenerateBackupCodes = async () => {
    if (backupCodeMutation.isPending) {
      return
    }

    const trimmedPassword = backupPassword.trim()
    if (!trimmedPassword) {
      toast.error("Current password is required")
      return
    }

    try {
      const response = await backupCodeMutation.mutateAsync({
        currentPassword: trimmedPassword,
      })
      setBackupCodes(response)
      setShowBackupPasswordForm(false)
      toast.success("Backup codes generated")
    } catch (error) {
      notifyApiError(error)
    }
  }

  const handleStartBackupRegenerate = () => {
    setBackupPassword("")
    setShowBackupPasswordForm(true)
  }

  const handleCopyBackupCodes = async () => {
    if (!backupCodes?.recoveryCodes.length) {
      toast.error("Generate backup codes first")
      return
    }
    if (!window.isSecureContext || !navigator.clipboard?.writeText) {
      toast.error("Clipboard access is unavailable")
      return
    }

    try {
      await navigator.clipboard.writeText(backupCodes.recoveryCodes.join("\n"))
      toast.success("Backup codes copied")
    } catch (error) {
      notifyApiError(error, "Unable to copy backup codes")
    }
  }

  const handleDownloadBackupCodes = () => {
    if (!backupCodes?.recoveryCodes.length) {
      toast.error("Generate backup codes first")
      return
    }

    const content = backupCodes.recoveryCodes.join("\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "recovery-codes.txt"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handlePrintBackupCodes = () => {
    if (!backupCodes?.recoveryCodes.length) {
      toast.error("Generate backup codes first")
      return
    }

    const printWindow = window.open("", "_blank", "width=640,height=800")
    if (!printWindow) {
      handleDownloadBackupCodes()
      toast.error("Pop-up blocked. Downloaded recovery codes instead.")
      return
    }

    const content = backupCodes.recoveryCodes.join("\n")
    const pre = printWindow.document.createElement("pre")
    pre.textContent = content
    pre.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    pre.style.whiteSpace = "pre-wrap"
    printWindow.document.body.appendChild(pre)
    printWindow.document.title = "Recovery codes"
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  return {
    isBackupDialogOpen: isDialogOpen,
    handleBackupDialogChange,
    backupPassword,
    setBackupPassword,
    backupCodes,
    backupCodesPreview,
    isBackupViewOnly,
    showBackupPasswordForm,
    handleGenerateBackupCodes,
    handleStartBackupRegenerate,
    handleCopyBackupCodes,
    handleDownloadBackupCodes,
    handlePrintBackupCodes,
    isBackupPending: backupCodeMutation.isPending,
  }
}
