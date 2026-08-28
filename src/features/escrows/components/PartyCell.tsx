import { getInitials } from "@/lib/utils/getInitials";

export default function PartyCell({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
        style={{ background: "linear-gradient(135deg, #D19E00, #2563EB)" }}
      >
        {getInitials(name)}
      </span>
      <div>
        <p className="text-brand-gray-dark dark:text-gray-200 leading-tight">
          {name}
        </p>
        <p className="text-xs text-brand-gray-light leading-tight">{email}</p>
      </div>
    </div>
  );
}