export const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "approved":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "rejected":
      return "bg-rose-50 text-rose-700 border-rose-200";

    case "activated":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

