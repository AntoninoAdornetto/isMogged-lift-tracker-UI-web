import React from "react";
import { Outlet, Link } from "react-router-dom";

import Container from "@layouts/container";
import { navigationSelections } from "./routes";

type NavigationProps = {
  userID: string;
};

export default function Navigation({ userID }: NavigationProps) {
  return (
    <>
      <Container>
        <Outlet />
      </Container>

      <div data-testid='navigation--container'>
        <nav className='fixed bottom-0 w-screen'>
          <ul className='grid grid-cols-6 text-center text-xs'>
            {navigationSelections.map(({ href, icon, id, page, styles }) => (
              <li
                key={page}
                className={`${styles} pt-2 pb-2 flex flex-col items-center`}
                data-testid={id}
              >
                <Link to={`${href}/${userID}`}>
                  <img src={icon} width='25' height='25' className='m-auto' />
                  {page}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
