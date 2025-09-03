"use client";
import React, { useState } from "react";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  NavItems,
  Navbar,
  NavbarButton,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";

const navItems = [
  { name: "Algorithms", link: "/#algorithms" },
  { name: "Features", link: "/#features" },
  { name: "Documentation", link: "https://github.com/WilliamHoltsdalen/algviz/blob/main/README.md" },
  { name: "Contact", link: "https://www.linkedin.com/in/william-holtsdalen/" },
];

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <Navbar className="top-0">
      <NavBody className="">
        <div className="flex flex-1 items-center">
          <NavbarLogo />
        </div>

        <NavItems items={navItems} onItemClick={closeMenu} />

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <NavbarButton href="/app" variant="primary">
            Get Started
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav className="">
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isOpen} onClose={closeMenu}>
          <div className="flex w-full flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="rounded-md px-3 py-2 text-base text-neutral-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                onClick={closeMenu}
              >
                {item.name}
              </a>
            ))}
            <NavbarButton as="a" href="/app" variant="gradient">
              Get Started
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};

export default Header;


