import React from "react";
import { Link, useSearchParams } from "react-router-dom";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="min-h-screen bg-[#f3f6fa] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm p-8 w-[500px] text-center">
        <h1 className="text-[24px] font-semibold text-[#0a1d2e] mb-3">
          Search Results
        </h1>

        <p className="text-[#66788a] text-[14px] mb-6">
          You searched for:
        </p>

        <div className="bg-[#f3f6fa] rounded-md px-4 py-3 text-[#0a1d2e] font-medium mb-6">
          {query || "Nothing searched"}
        </div>

        <p className="text-[13px] text-[#7a8998] mb-6">
          Search functionality will be connected to Brands, Products,
          Shipments and Content Deadlines.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-5 h-[40px] rounded-[6px] bg-[#e96a28] text-white text-[13px] font-semibold hover:bg-[#d95d1e]"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Search;