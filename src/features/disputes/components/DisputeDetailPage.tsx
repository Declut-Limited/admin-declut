import { useParams, useNavigate } from "react-router-dom";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoIosCloseCircle} from "react-icons/io";
import { RiDeleteBin6Fill} from "react-icons/ri";
import Button from "@/components/generic/Button";
import type { DisputeDetail } from "../types";
import placeholderImage from "@/assets/listing-header.jpg"
import NotFoundState from "@/components/generic/NotFoundState";

// placeholder 
const mockDisputes: Record<string, DisputeDetail> = {
  "RPT-001": {
    reportCode: "RPT-001",
    category: "Offensive content",
    status: "New",
    listing: {
      name: "6-Seater Dining Set",
      code: "LST-001",
      submittedDate: "Apr 9, 2026",
    },
    reporter: {
      role: "Buyer",
      status: "Active",
      company: "Delta Electronics",
      memberSince: "Apr 27, 2025",
      rating: 5,
    },
  },
};

export default function DisputeDetailPage() {
  const { reportCode } = useParams<{ reportCode: string }>();
  const navigate = useNavigate();
  const dispute = reportCode ? mockDisputes[reportCode] : undefined;

  if (!dispute) {
    return <NotFoundState icon={<FiAlertCircle className="w-5 h-5" />} message="Dispute not found." />;
  }

  return (
    <div>
      <button
        onClick={() => navigate("/disputes")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Disputes
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-[#FAFAFA] dark:bg-gray-900/50 rounded-xl p-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1D2939] dark:text-gray-100 tracking-wide">
              Report {dispute.reportCode}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-brand-blue dark:bg-blue-950 dark:text-blue-400">
              {dispute.status}
            </span>
          </div>
          <p className="text-xs text-brand-gray-light mt-0.5">
            {dispute.reportCode} · {dispute.category}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            leftIcon={<BsCheckCircleFill className="w-4 h-4" />}
            bgColor="bg-green-600 hover:bg-green-700"
            textColor="text-white"
            borderColor="border-transparent"
          >
            Resolve
          </Button>
          <Button leftIcon={<IoIosCloseCircle className="w-4 h-4 text-[#98A2B3]" />}>Dismiss</Button>
          <Button
            leftIcon={<RiDeleteBin6Fill className="w-4 h-4" />}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-[#F04438]"
            borderColor="border-red-200 dark:border-red-900"
          >
            Remove Listing
          </Button>
        </div>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 detail-section-card border-none">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
              Reported Listing
            </p>
            <a href="#" className="text-xs text-amber-600 hover:underline flex items-center gap-1">
              View Listing ↗
            </a>
          </div>

          <div className="flex items-center gap-3">
            <img src={placeholderImage} className="w-12 h-12 rounded-lg shrink-0" />
            <div>
              <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                {dispute.listing.name}
              </p>
              <p className="text-xs text-brand-gray-light">
                {dispute.listing.code} · Submitted {dispute.listing.submittedDate}
              </p>
            </div>
          </div>
        </div>

        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">Reporter</p>
          <div className="profile-info-row">
            <span className="profile-info-label">Role</span>
            <span className="profile-info-value">{dispute.reporter.role}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
              {dispute.reporter.status}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Company</span>
            <span className="profile-info-value">{dispute.reporter.company}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Member Since</span>
            <span className="profile-info-value">{dispute.reporter.memberSince}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Rating</span>
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < dispute.reporter.rating ? "text-amber-400" : "text-gray-200"}>★</span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}