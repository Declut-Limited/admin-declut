export interface DisputeRow {
  id: string;
  reportCode: string;
  target: string;
  reporterName: string;
  reason: string;
  status: "New" | "Investigating" | "Dismissed" | "Resolved";
  joined: string;
}

export interface DisputeDetail {
  reportCode: string;
  category: string;
  status: DisputeRow["status"];
  listing: {
    name: string;
    code: string;
    imageUrl?: string;
    submittedDate: string;
  };
  reporter: {
    role: string;
    status: "Active" | "Suspended";
    company: string;
    memberSince: string;
    rating: number;
  };
}