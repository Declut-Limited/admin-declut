import Button from "@/components/generic/Button";
import FormInput from "@/components/generic/FormInput";
import Skeleton from "@/components/generic/Skeleton";
import { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
// import avatarPlaceholder from "@/assets/avatar.svg";
import PhoneInput from "@/components/generic/PhoneInput";
import { useMe, useUpdateProfileGeneral } from "@/features/auth/queries";
import type { AdminProfile } from "@/features/auth/types";
import { showToast } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";

const COUNTRY_CODES = ["+234", "+233", "+254", "+27", "+44", "+1"];
const DEFAULT_COUNTRY_CODE = "+234";

function splitPhone(phone: string) {
  const match = COUNTRY_CODES.find((code) => phone.startsWith(code));
  if (match) {
    return { code: match, number: phone.slice(match.length) };
  }
  return { code: DEFAULT_COUNTRY_CODE, number: phone ?? "" };
}

export function GeneralTab() {
  const { data: me, isLoading, isError, error } = useMe();

  if (isLoading) {
    return (
      <div className="settings-panel">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError || !me) {
    return (
      <div className="settings-panel">
        <p className="text-sm text-brand-gray-dark dark:text-gray-300">
          {getApiErrorMessage(error, "Couldn't load your profile.")}
        </p>
      </div>
    );
  }

  return <GeneralForm me={me} />;
}

function GeneralForm({ me }: { me: AdminProfile }) {
  const { mutateAsync: updateGeneral, isPending } = useUpdateProfileGeneral();

  const initial = {
    firstName: me.firstName ?? "",
    lastName: me.lastName ?? "",
    phoneCountryCode: splitPhone(me.phone ?? "").code,
    phoneNumber: splitPhone(me.phone ?? "").number,
    email: me.email ?? "",
  };

  const [formData, setFormData] = useState(initial);

  const onChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    showToast.promise(
      updateGeneral({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phoneNumber.trim(),
        email: formData.email.trim(),
      }),
      {
        loading: "Saving changes...",
        success: "Profile updated.",
        error: "Couldn't save your profile.",
      },
    );
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">General</h3>

      {/* TODO: no avatar upload endpoint yet
      <div className="profile-photo-row">
        <img
          src={formData.photo_url || avatarPlaceholder}
          alt=""
          className="profile-photo-preview"
        />
        <div className="flex-1">
          <p className="profile-photo-title">Profile photo</p>
          <p className="profile-photo-hint">
            JPG, PNG or WEBP. Maximum file size 5MB.
          </p>
        </div>
        <div className="profile-photo-actions">
          <Button
            onClick={() => {}}
            bgColor="bg-white dark:bg-gray-800"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            Upload New Photo
          </Button>
          <button
            type="button"
            className="profile-photo-remove"
            onClick={() => {}}
          >
            Remove
          </button>
        </div>
      </div> */}

      <div className="settings-field-row">
        <div className="settings-field">
          <FormInput
            label="First Name"
            value={formData.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
        </div>
        <div className="settings-field">
          <FormInput
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="settings-field-row">
        <div className="settings-field">
          <label className="block text-xs text-[#1D2939] dark:text-gray-300 mb-1.5 font-medium">
            Phone Number
          </label>
          <PhoneInput
            countryCode={formData.phoneCountryCode}
            countryCodeOptions={COUNTRY_CODES}
            onCountryCodeChange={(val) => onChange("phoneCountryCode", val)}
            value={formData.phoneNumber}
            onChange={(val) => onChange("phoneNumber", val)}
          />
        </div>
        <div className="settings-field mt-1">
          <FormInput
            label="Work Email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => setFormData(initial)}
          bgColor="bg-white dark:bg-gray-800"
          textColor="text-brand-gray-dark dark:text-gray-200"
          borderColor="border-gray-200 dark:border-gray-700"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isPending}
          bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
          textColor="text-white"
          borderColor="border-transparent"
        >
          <BsCheckCircleFill className="mr-1.5" />
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
