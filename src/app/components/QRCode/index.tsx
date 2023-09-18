import { QRCode } from "react-qrcode-logo";
import { useTheme } from "~/app/utils";

export type Props = {
  value: string;
  size?: number;
  className?: string;
};

export default function QRCodeLogo({ value, size, className }: Props) {
  const theme = useTheme();
  const fgColor = theme === "dark" ? "#FFFFFF" : "#000000";
  const bgColor = theme === "dark" ? "#000000" : "#FFFFFF";
  const logoLink = "assets/icons/alby_icon_yellow_64x64.png";

  return (
    <QRCode
      value={value}
      size={size || 280}
      fgColor={fgColor}
      bgColor={bgColor}
      ecLevel="M"
      logoImage={logoLink}
      logoPadding={0}
      logoPaddingStyle={"circle"}
      eyeColor={fgColor}
      quietZone={0}
    />
  );
}
