import React from "react"
import { icons } from "../../constants/icons"

export function Icon({
  src,
  size = 20,
  className = "",
}: {
  src: string
  size?: number
  className?: string
}) {
  return (
    <img
      alt=""
      className={`shrink-0 ${className}`}
      height={size}
      src={src}
      width={size}
    />
  )
}

export function Badge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode
  tone?: "blue" | "red" | "amber"
}) {
  const color =
    tone === "red"
      ? "bg-[#faedea] text-[#af4540]"
      : tone === "amber"
        ? "bg-[#fbf2e3] text-[#936020]"
        : "bg-[#edf2fa] text-[#031f50]"
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${color}`}
    >
      {children}
    </span>
  )
}

export function Card({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const backgroundClass = className.includes("bg-") ? "" : "bg-white"
  const borderClass = className.includes("border-[")
    ? ""
    : "border-[#dae2ee]"
  return (
    <div
      className={`w-full rounded-[20px] border p-[18px] text-left transition-all ${backgroundClass} ${borderClass} ${className} ${
        onClick
          ? "cursor-pointer hover:border-[#b8c9e0] active:scale-[0.99]"
          : ""
      }`}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

export function SectionTitle({
  children,
  action,
  onAction,
}: {
  children: React.ReactNode
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[17px] font-bold text-[#031f50]">{children}</h2>
      {action && (
        <button
          className="text-xs font-semibold text-[#24518c] transition-opacity hover:opacity-80"
          onClick={onAction}
        >
          {action}
        </button>
      )}
    </div>
  )
}

export function Row({
  icon,
  title,
  detail,
  onClick,
}: {
  icon: string
  title: string
  detail: string
  onClick?: () => void
}) {
  const Tag = onClick ? "button" : "div"
  return (
    <Tag
      className="flex w-full items-center gap-3 text-left transition-opacity hover:opacity-90 active:opacity-75"
      onClick={onClick}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf2fa]">
        <Icon size={20} src={icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[#031f50]">
          {title}
        </span>
        <span className="mt-0.5 block text-xs leading-[1.45] text-[#53657c]">
          {detail}
        </span>
      </span>
      {onClick && <Icon size={16} src={icons.chevron} />}
    </Tag>
  )
}

export function Guidance({
  title,
  children,
  tone = "blue",
}: {
  title: string
  children: React.ReactNode
  tone?: "blue" | "amber"
}) {
  return (
    <div
      className={`flex gap-2.5 rounded-[14px] p-3.5 text-[13px] leading-[1.45] ${
        tone === "amber"
          ? "bg-[#fbf2e3] text-[#936020]"
          : "bg-[#edf2fa] text-[#173b71]"
      }`}
    >
      <Icon size={19} src={tone === "amber" ? icons.alert : icons.shield} />
      <div>
        <p className="font-semibold">{title}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  danger = false,
  disabled = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
}) {
  return (
    <button
      className={`min-h-[50px] w-full rounded-[14px] px-4 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 ${
        danger
          ? "bg-[#af4540] hover:bg-[#973a36]"
          : "bg-[#031f50] hover:bg-[#072a6b]"
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      className="min-h-[50px] w-full rounded-[14px] border border-[#dae2ee] bg-white px-4 text-sm font-semibold text-[#031f50] transition-all hover:bg-[#f4f7fb] active:scale-[0.98] disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function ScreenIntro({
  icon,
  title,
  subtitle,
}: {
  icon: string
  title: string
  subtitle: string
}) {
  return (
    <div className="text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#edf2fa]">
        <Icon size={28} src={icon} />
      </span>
      <h2 className="mt-4 text-xl font-bold text-[#031f50]">{title}</h2>
      <p className="mt-2 text-xs leading-[1.5] text-[#53657c]">{subtitle}</p>
    </div>
  )
}

export function Choice({
  icon,
  title,
  detail,
  selected = false,
  onClick,
}: {
  icon?: string
  title: string
  detail: string
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <button
      className={`flex w-full items-start gap-3.5 rounded-[18px] border p-4 text-left transition-all ${
        selected
          ? "border-[#24518c] bg-[#edf2fa]/60 shadow-sm"
          : "border-[#dae2ee] bg-white hover:border-[#b8c9e0]"
      }`}
      onClick={onClick}
    >
      {icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf2fa]">
          <Icon size={20} src={icon} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#031f50]">{title}</p>
        <p className="mt-1 text-xs leading-[1.45] text-[#53657c]">{detail}</p>
      </div>
      <div
        className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? "border-[#24518c] bg-[#24518c] text-white"
            : "border-[#b8c9e0]"
        }`}
      >
        {selected && <Icon size={12} src={icons.check} />}
      </div>
    </button>
  )
}
