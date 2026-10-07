"use client";

import { useState } from "react";
import Pagination from "./pagination/Pagination";
import { newsData } from "@/data/news";
import NewsPage from "@/app/blog/pagination/News";

// Maketda bir sahifada 12 ta yangilik
const PER_PAGE = 12;

export default function NewsList() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(newsData.length / PER_PAGE);

  const currentItems = newsData.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <NewsPage items={currentItems} />

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
