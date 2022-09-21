import React, { useEffect, useState } from "react";
import { fetchWithCache } from "@react-mf/api";

import { Link } from "@reach/router";

export function getConfig() {
  return fetchWithCache("config");
}

export default function Root(props) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getConfig().subscribe((data) => setOptions(data.results.menu));
  });

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-primary text-white">
      <div className="flex items-center justify-between">
        {options.map((link) => {
          return (
            <Link key={link.id} className="p-6" to={link.href}>
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
