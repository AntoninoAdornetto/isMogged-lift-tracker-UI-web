import React from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function renderWithProvider(children: React.ReactNode) {
  render(<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);
}
