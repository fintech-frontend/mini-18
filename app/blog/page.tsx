"use client";

import { useState } from "react";
import Pagination from "./pagination/Pagination";
import { newsData } from "@/data/news";
import NewsPage from "@/app/blog/pagination/News";

const PER_PAGE = 2;

export default function NewsList() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(newsData.length / PER_PAGE);

  const currentItems = newsData.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  return (
    <div>
        <NewsPage/>
      {/* kartochkalar grid — currentItems.map(...) */}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}