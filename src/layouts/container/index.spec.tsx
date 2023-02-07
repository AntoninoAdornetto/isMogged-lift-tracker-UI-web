import React from "react";
import Container from ".";
import { cleanup, render, screen } from "@testing-library/react";

function init() {
  render(
    <Container>
      <div data-testid='container--content'>Container</div>
    </Container>
  );
}

describe(Container, () => {
  beforeEach(init);
  afterEach(cleanup);

  test("Container renders", () => {
    screen.getByTestId("main--container");
  });

  test("Children render", () => {
    screen.getByTestId("container--content");
  });
});
