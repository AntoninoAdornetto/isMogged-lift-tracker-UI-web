import React from "react";
import { screen, cleanup } from "@testing-library/react";
import renderWithProvider from "@utils/renderWithProvider";

import Navigation from "./index";
import { navigationSelections } from "./routes";

const mockUserID = "0000-0000-0000-00001";

function init() {
  renderWithProvider(<Navigation userID={mockUserID} />);
}

describe(Navigation, () => {
  beforeEach(init);
  afterEach(cleanup);

  test("Navigation renders", () => {
    screen.getByTestId("navigation--container");
  });

  test("Navigation text renders", () => {
    navigationSelections.forEach((v) => {
      const link = screen.getByTestId(v.id);
      expect(link).toHaveTextContent(v.page);
    });
  });

  test("All href's have the userId appended", () => {
    const links: HTMLAnchorElement[] = screen.getAllByRole("link");

    links.forEach((v, i) => {
      expect(v.href).toContain(navigationSelections[i].href + `/${mockUserID}`);
    });
  });

  test("Container component renders to display main content", () => {
    screen.getByTestId("main--container");
  });
});
