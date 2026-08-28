import { useState, useMemo, useEffect } from "react";
import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import FormTextarea from "@/components/generic/FormTextArea";
import CustomSelect from "@/components/generic/CustomSelect";
import Pagination from "@/components/generic/Pagination";
import Skeleton from "@/components/generic/Skeleton";
import { FiSearch } from "react-icons/fi";
import { useUninvitedWaitlist } from "../queries";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
import type { BulkInvitePayload } from "../types";

interface InviteUsersModalProps {
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (payload: BulkInvitePayload) => void;
}

const MAX_RECIPIENTS = 100;

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function InviteUsersModal({
  isSubmitting,
  onClose,
  onConfirm,
}: InviteUsersModalProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState<{ id: string; email: string }[]>([]);
  const [message, setMessage] = useState("");
  const [pageSize, setPageSize] = useState("50");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const size = Number(pageSize);

  const { data, isLoading, isError, error } = useUninvitedWaitlist({
    page: currentPage,
    limit: size,
    search: debouncedSearch || undefined,
  });

  const paginated = data?.results ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  const selectedIds = useMemo(() => selected.map((s) => s.id), [selected]);
  const pageIds = paginated.map((u) => u._id);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  const toggleUser = (id: string, email: string) => {
    setSelected((prev) =>
      prev.some((s) => s.id === id)
        ? prev.filter((s) => s.id !== id)
        : prev.length >= MAX_RECIPIENTS
          ? prev
          : [...prev, { id, email }],
    );
  };

  const toggleAllOnPage = () => {
    setSelected((prev) => {
      if (allOnPageSelected) return prev.filter((s) => !pageIds.includes(s.id));
      const additions = paginated
        .filter((u) => !prev.some((s) => s.id === u._id))
        .map((u) => ({ id: u._id, email: u.email }));
      return [...prev, ...additions].slice(0, MAX_RECIPIENTS);
    });
  };

  const canSubmit = selected.length > 0 && message.trim().length > 0;

  return (
    <BaseModal
      title="Invite Users"
      onClose={onClose}
      width="max-w-3xl"
      footer={
        <>
          <span className="text-xs text-brand-gray-light mr-auto">
            {selected.length} of {total} recipients selected
          </span>
          <Button
            onClick={onClose}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              canSubmit &&
              onConfirm({ recipients: selected, message: message.trim() })
            }
            disabled={!canSubmit || isSubmitting}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            {isSubmitting ? "Inviting..." : `Invite Users (${selected.length})`}
          </Button>
        </>
      }
    >
      <div className="p-4 mb-4">
        <p className="text-sm font-semibold text-brand-gray-dark uppercase tracking-wide">
          Pending Users · {total}
        </p>
        <p className="text-xs text-brand-gray-light mb-3">
          {total > 0
            ? `Showing ${(currentPage - 1) * size + 1}-${Math.min(
                currentPage * size,
                total,
              )}`
            : "No pending users"}
        </p>

        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-light w-4 h-4" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-brand-gray-dark dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
      </div>

      <div className="flex items-start justify-between mb-3 p-4">
        <div>
          <p className="text-sm font-semibold text-brand-gray-dark uppercase tracking-wide">
            Select Recipients
          </p>
          <p className="text-xs text-brand-gray-light">
            Choose up to {MAX_RECIPIENTS} waitlist users to receive this
            invitation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="flex items-center gap-2 text-xs text-brand-gray-dark dark:text-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={allOnPageSelected}
              onChange={toggleAllOnPage}
              className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
            />
            Select all on this page
          </label>
          <span className="text-xs text-brand-gray-light">
            {selected.length} selected
          </span>
          <button
            type="button"
            onClick={() => setSelected([])}
            className="text-xs text-brand-blue hover:underline cursor-pointer"
          >
            Clear selection
          </button>
        </div>
      </div>

      <div className="invite-recipient-list">
        {isError ? (
          <p className="text-sm text-brand-gray-dark dark:text-gray-300 py-8 text-center">
            {getApiErrorMessage(error, "Couldn't load pending users.")}
          </p>
        ) : isLoading ? (
          <div className="flex flex-col gap-2 py-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <p className="text-sm text-brand-gray-light py-8 text-center">
            No pending users to invite.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-brand-gray-light">
                <th className="font-medium pb-2 w-10">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleAllOnPage}
                    className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                  />
                </th>
                <th className="font-medium pb-2">Email</th>
                <th className="font-medium pb-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-50 dark:border-gray-800"
                >
                  <td className="py-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user._id)}
                      onChange={() => toggleUser(user._id, user.email)}
                      className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                    />
                  </td>
                  <td className="py-2.5 text-brand-gray-dark dark:text-gray-200">
                    {user.email}
                  </td>
                  <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 mt-2 mb-4">
        <div className="flex items-center gap-2 shrink-0 m-4">
          <span className="text-xs text-brand-gray-light">Show:</span>
          <div className="w-18">
            <CustomSelect
              value={pageSize}
              options={["25", "50", "100"]}
              onChange={(val) => {
                setPageSize(val);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="w-90">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <div className="m-4">
        <FormTextarea
          label="Invitation Message"
          required
          rows={5}
          placeholder="Write the content..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
    </BaseModal>
  );
}