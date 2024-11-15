"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const useTableNumber = () => {
  const [tableNo, setTableNo] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const table = router.query.tableNo; // Get the table number from the query
    if (typeof table === 'string' || (Array.isArray(table) && table.length > 0)) {
      const tableValue = Array.isArray(table) ? table[0] : table;
      setTableNo(tableValue);
      sessionStorage.setItem("tableNo", tableValue);
    }
  }, [router.query.tableNo]);

  return tableNo;
};

export default useTableNumber;