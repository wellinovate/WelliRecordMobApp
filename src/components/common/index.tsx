import React from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  type ImageSourcePropType,
} from "react-native";
import type { SvgProps } from "react-native-svg";
import { icons } from "../../constants/icons";

// Figma icons come in two shapes after metro.config.js's svg-transformer
// wiring: every *.svg import is a react-native-svg component, the two *.png
// entries (logo, hospitalPhoto) are ordinary RN image sources.
type IconSource = React.ComponentType<SvgProps> | ImageSourcePropType;

// Vertical spacing wrapper every screen uses for its body content — mirrors
// the original web build's `.stack` CSS class (grid, 20px gaps).
export function ScreenStack({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <View className={`gap-5 ${className}`}>{children}</View>;
}

// Shared eyebrow/title/copy header used at the top of most onboarding and
// detail screens.
export function ScreenIntroHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <View>
      <Text className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#53657c]">
        {eyebrow}
      </Text>
      <Text className="mt-2 text-2xl font-bold text-[#031f50]">{title}</Text>
      <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
        {copy}
      </Text>
    </View>
  );
}

export function LabeledInput({
  label,
  helper,
  className = "",
  ...inputProps
}: {
  label: string;
  helper?: string;
  className?: string;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View className={className}>
      <Text className="text-sm font-semibold text-[#031f50]">{label}</Text>
      <TextInput
        className="mt-2 h-12 w-full rounded-xl border border-[#dae2ee] bg-white px-3 text-sm text-[#031f50]"
        placeholderTextColor="#95a3b5"
        {...inputProps}
      />
      {helper && (
        <Text className="mt-2 text-xs text-[#53657c]">{helper}</Text>
      )}
    </View>
  );
}

export function Icon({
  src,
  size = 20,
  className = "",
}: {
  src: IconSource;
  size?: number;
  className?: string;
}) {
  if (typeof src === "function") {
    const SvgIcon = src;
    return <SvgIcon className={className} height={size} width={size} />;
  }
  return (
    <Image
      className={className}
      source={src}
      style={{ width: size, height: size }}
    />
  );
}

export function Badge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "red" | "amber";
}) {
  const [bg, text] =
    tone === "red"
      ? ["bg-[#faedea]", "text-[#af4540]"]
      : tone === "amber"
        ? ["bg-[#fbf2e3]", "text-[#936020]"]
        : ["bg-[#edf2fa]", "text-[#031f50]"];
  // self-start keeps the pill hugging its text inside column parents (the web
  // build got this from inline-flex, which doesn't exist in React Native).
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${bg}`}>
      <Text className={`text-[11px] font-semibold ${text}`}>{children}</Text>
    </View>
  );
}

export function Card({
  children,
  className = "",
  onPress,
}: {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}) {
  const backgroundClass = className.includes("bg-") ? "" : "bg-white";
  const borderClass = className.includes("border-[")
    ? ""
    : "border-[#dae2ee]";
  const Container = onPress ? Pressable : View;
  return (
    <Container
      accessibilityRole={onPress ? "button" : undefined}
      className={`w-full rounded-[20px] border p-[18px] ${backgroundClass} ${borderClass} ${className} ${
        onPress ? "active:opacity-80" : ""
      }`}
      onPress={onPress}
    >
      {children}
    </Container>
  );
}

export function SectionTitle({
  children,
  action,
  onAction,
}: {
  children: React.ReactNode;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-[17px] font-bold text-[#031f50]">{children}</Text>
      {action && (
        <Pressable accessibilityRole="button" onPress={onAction}>
          <Text className="text-xs font-semibold text-[#24518c]">
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export function Row({
  icon,
  title,
  detail,
  onPress,
}: {
  icon: IconSource;
  title: string;
  detail: string;
  onPress?: () => void;
}) {
  const Container = onPress ? Pressable : View;
  return (
    <Container
      accessibilityRole={onPress ? "button" : undefined}
      className="w-full flex-row items-center gap-3 active:opacity-75"
      onPress={onPress}
    >
      <View className="size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf2fa]">
        <Icon size={20} src={icon} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-semibold text-[#031f50]">{title}</Text>
        <Text className="mt-0.5 text-xs leading-[1.45] text-[#53657c]">
          {detail}
        </Text>
      </View>
      {onPress && <Icon size={16} src={icons.chevron} />}
    </Container>
  );
}

export function Guidance({
  title,
  children,
  tone = "blue",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "blue" | "amber";
}) {
  return (
    <View
      className={`flex-row gap-2.5 rounded-[14px] p-3.5 ${
        tone === "amber" ? "bg-[#fbf2e3]" : "bg-[#edf2fa]"
      }`}
    >
      <Icon size={19} src={tone === "amber" ? icons.alert : icons.shield} />
      <View className="shrink">
        <Text
          className={`text-[13px] font-semibold ${
            tone === "amber" ? "text-[#936020]" : "text-[#173b71]"
          }`}
        >
          {title}
        </Text>
        <View className="mt-1">{children}</View>
      </View>
    </View>
  );
}

export function PrimaryButton({
  children,
  onPress,
  danger = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-[50px] w-full items-center justify-center rounded-[14px] px-4 active:opacity-80 disabled:opacity-50 ${
        danger ? "bg-[#af4540]" : "bg-[#031f50]"
      }`}
      disabled={disabled}
      onPress={onPress}
    >
      <Text className="text-sm font-semibold text-white">{children}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  children,
  onPress,
  disabled = false,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="min-h-[50px] w-full items-center justify-center rounded-[14px] border border-[#dae2ee] bg-white px-4 active:opacity-80 disabled:opacity-50"
      disabled={disabled}
      onPress={onPress}
    >
      <Text className="text-sm font-semibold text-[#031f50]">{children}</Text>
    </Pressable>
  );
}

export function ScreenIntro({
  icon,
  title,
  subtitle,
}: {
  icon: IconSource;
  title: string;
  subtitle: string;
}) {
  return (
    <View className="items-center">
      <View className="size-14 items-center justify-center rounded-2xl bg-[#edf2fa]">
        <Icon size={28} src={icon} />
      </View>
      <Text className="mt-4 text-xl font-bold text-[#031f50]">{title}</Text>
      <Text className="mt-2 text-center text-xs leading-[1.5] text-[#53657c]">
        {subtitle}
      </Text>
    </View>
  );
}

export function Choice({
  icon,
  title,
  detail,
  selected = false,
  onPress,
}: {
  icon?: IconSource;
  title: string;
  detail: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`w-full flex-row items-start gap-3.5 rounded-[18px] border p-4 ${
        selected
          ? "border-[#24518c] bg-[#edf2fa]"
          : "border-[#dae2ee] bg-white"
      }`}
      onPress={onPress}
    >
      {icon && (
        <View className="size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf2fa]">
          <Icon size={20} src={icon} />
        </View>
      )}
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-semibold text-[#031f50]">{title}</Text>
        <Text className="mt-1 text-xs leading-[1.45] text-[#53657c]">
          {detail}
        </Text>
      </View>
      <View
        className={`size-5 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-[#24518c] bg-[#24518c]" : "border-[#b8c9e0]"
        }`}
      >
        {selected && <Icon size={12} src={icons.check} />}
      </View>
    </Pressable>
  );
}
