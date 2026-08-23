import Button from "@/components/generic/Button";
import FormInput from "@/components/generic/FormInput";
import { useState } from "react";
import type { ProfileGeneral } from "../types";
import { BsCheckCircleFill } from "react-icons/bs";
import avatarPlaceholder from "@/assets/avatar.svg";
import PhoneInput from "@/components/generic/PhoneInput";

export function GeneralTab() {
  const [formData, setFormData] = useState<ProfileGeneral>({
    first_name: "",
    last_name: "",
    phone_number: "",
    phone_country_code: "+234",
    work_email: "",
  });

  const onChange = (field: keyof ProfileGeneral, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">General</h3>

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
      </div>

      <div className="settings-field-row">
        <div className="settings-field">
          <FormInput
            label="First Name"
            value={formData.first_name}
            onChange={(e) => onChange("first_name", e.target.value)}
          />
        </div>
        <div className="settings-field">
          <FormInput
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => onChange("last_name", e.target.value)}
          />
        </div>
      </div>

      <div className="settings-field-row">
        <div className="settings-field">
          <label className="block text-xs text-[#1D2939] dark:text-gray-300 mb-1.5 font-medium">
            Phone Number
          </label>
          <PhoneInput
            countryCode={formData.phone_country_code}
            countryCodeOptions={["+234"]}
            onCountryCodeChange={(val) => onChange("phone_country_code", val)}
            value={formData.phone_number}
            onChange={(val) => onChange("phone_number", val)}
          />
        </div>
        <div className="settings-field mt-1">
          <FormInput
            label="Work Email"
            type="email"
            value={formData.work_email}
            onChange={(e) => onChange("work_email", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => {}}
          bgColor="bg-white dark:bg-gray-800"
          textColor="text-brand-gray-dark dark:text-gray-200"
          borderColor="border-gray-200 dark:border-gray-700"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {}}
          bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
          textColor="text-white"
          borderColor="border-transparent"
        >
          <BsCheckCircleFill className="mr-1.5" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
