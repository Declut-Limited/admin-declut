import avatarPlaceholder from "@/assets/avatar.svg";

export default function PartyCell({ name, email, avatarUrl }: { name: string; email: string; avatarUrl?: string }) {
  return (
    <div className="flex items-center gap-2">
      <img src={avatarUrl || avatarPlaceholder} alt={name} className="w-7 h-7 rounded-full object-cover" />
      <div>
        <p className="text-brand-gray-dark dark:text-gray-200 leading-tight">{name}</p>
        <p className="text-xs text-brand-gray-light leading-tight">{email}</p>
      </div>
    </div>
  );
}