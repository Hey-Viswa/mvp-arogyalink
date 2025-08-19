"use client";

import { useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

const ClientOnly = ({ children }: ClientOnlyProps) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // You can return a loading spinner or a skeleton here if you want.
    // Returning null will render nothing on the server and on the initial client render.
    return null;
  }

  return <>{children}</>;
};

export default ClientOnly;
