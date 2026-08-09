export interface ContentRow {
  id: string;
  title: string;
  type: "FAQ" | "Page" | "Banner";
  placement: string;
  status: "Draft" | "Published";
  updated: string;
  authorName: string;
}

export interface ContentDetail {
  code: string;
  title: string;
  status: ContentRow["status"];
  type: ContentRow["type"];
  placement: string;
  updated: string;
  renderedPreview: string;
  placementDetail: {
    appearsOn: string;
    pageUrl: string;
  };
  author: {
    name: string;
    id: string;
    email: string;
    avatarUrl?: string;
    role: string;
    status: "Active" | "Suspended";
    company: string;
    totalListings: number;
    memberSince: string;
    rating: number;
  };
}