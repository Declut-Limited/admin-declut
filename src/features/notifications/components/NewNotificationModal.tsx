import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import FormInput from "@/components/generic/FormInput";
import CustomSelect from "@/components/generic/CustomSelect";
import Button from "@/components/generic/Button";
import DatePicker from "@/components/generic/DatePicker";
import TimePicker from "@/components/generic/TimePicker";

interface NewNotificationModalProps {
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
}

const notificationTypeOptions = [
  "Manual Broadcast - send a one-off message",
  "Automated Trigger - fire on a real system event",
];

const sendToOptions = ["A user segment", "A specific user"];
const audienceSegmentOptions = ["All Users", "Buyers", "Sellers", "Admins"];
const channelOptions = ["Push", "Email", "SMS"];
const deliveryOptions = [
  "Send immediately",
  "Schedule for later",
  "Save as draft",
];
const triggerEventOptions = [
  "Listing Approved - Admin approves a Pending Review listing",
  "Listing Flagged - Admin flags an Active listing",
  "Verification Approved - Admin approves a verification submission",
  "Verification Rejected - Admin rejects a verification submission",
  "Escrow Released - Admin releases held escrow",
  "Payout Processed - Admin marks a payout Paid",
  "Dispute Resolved - Admin resolves a dispute case",
  "Account Suspended - Admin suspends a user account",
  "Account Reactivated - Admin reactivates a user account",
];
const recipientOptions = [
  "Toluwani Bakare",
  "Hannah Pedro",
  "Emmanuel Amuneke",
  "Adaeze Ibrahim",
]; // placeholder — real list should come from a user search/lookup once endpoint exists

export default function NewNotificationModal({
  onClose,
  onSubmit,
}: NewNotificationModalProps) {
  const [messageTitle, setMessageTitle] = useState("");
  const [specificUser, setSpecificUser] = useState(recipientOptions[0]);
  const [notificationType, setNotificationType] = useState(
    notificationTypeOptions[0],
  );
  const [sendTo, setSendTo] = useState(sendToOptions[0]);
  const [audienceSegment, setAudienceSegment] = useState(
    audienceSegmentOptions[0],
  );
  const [triggerEvent, setTriggerEvent] = useState(triggerEventOptions[0]);
  const [channel, setChannel] = useState(channelOptions[0]);
  const [delivery, setDelivery] = useState(deliveryOptions[1]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("00:00");

  const isManualBroadcast = notificationType === notificationTypeOptions[0];

  const handleSubmit = () => {
    onSubmit({
      messageTitle,
      notificationType,
      sendTo: isManualBroadcast ? sendTo : "",
      audienceSegment: sendTo === "A user segment" ? audienceSegment : "",
      specificUser: sendTo === "A specific user" ? specificUser : "",
      triggerEvent: isManualBroadcast ? "" : triggerEvent,
      channel,
      delivery: isManualBroadcast ? delivery : "",
      date,
      time,
    });
  };

  return (
    <BaseModal
      title="New Notification"
      onClose={onClose}
      width="max-w-2xl"
      footer={
        <>
          <Button
            onClick={onClose}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            Create Notification
          </Button>
        </>
      }
    >
      <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 flex flex-col gap-4">
        <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
          Notification Information
        </p>

        <FormInput
          label="Message Title"
          required
          placeholder="e.g. Weekend promo live"
          value={messageTitle}
          onChange={(e) => setMessageTitle(e.target.value)}
        />

        <CustomSelect
          label="Notification Type"
          required
          value={notificationType}
          options={notificationTypeOptions}
          onChange={setNotificationType}
        />

        {isManualBroadcast ? (
          <div className="grid grid-cols-2 gap-4">
            <CustomSelect
              label="Send To"
              value={sendTo}
              options={sendToOptions}
              onChange={setSendTo}
            />
            {sendTo === "A specific user" ? (
              <CustomSelect
                label="Select User"
                value={specificUser}
                options={recipientOptions}
                onChange={setSpecificUser}
              />
            ) : (
              <CustomSelect
                label="Audience Segment"
                value={audienceSegment}
                options={audienceSegmentOptions}
                onChange={setAudienceSegment}
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <CustomSelect
              label="Audience Segment"
              value={audienceSegment}
              options={audienceSegmentOptions}
              onChange={setAudienceSegment}
            />
            <CustomSelect
              label="Trigger Event"
              value={triggerEvent}
              options={triggerEventOptions}
              onChange={setTriggerEvent}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            label="Channel"
            required
            value={channel}
            options={channelOptions}
            onChange={setChannel}
          />
          {isManualBroadcast && (
            <CustomSelect
              label="Delivery"
              value={delivery}
              options={deliveryOptions}
              onChange={setDelivery}
            />
          )}
        </div>

        {(delivery === "Schedule for later" || !isManualBroadcast) && (
          <div className="bg-[#F2F4F7] dark:bg-gray-900 rounded-lg p-3">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Schedule Date &amp; Time
            </p>
            <div className="grid grid-cols-2 gap-4">
              <DatePicker label="Date" value={date} onChange={setDate} />
              <TimePicker label="Time" value={time} onChange={setTime} />
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
