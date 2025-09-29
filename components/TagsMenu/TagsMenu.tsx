"use client";

import Link from "next/link";
import css from "./Tagsmenu.module.css";
import { useState } from "react";
import { tags } from "@/constants/tags";

const TagsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toogle = () => setIsOpen(!isOpen);
  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toogle}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {tags.map((el) => {
            return (
              <li className={css.menuItem} key={el}>
                <Link
                  href={
                    el === "All" ? "/notes/filter/All" : `/notes/filter/${el}`
                  }
                  className={css.menuLink}
                  onClick={toogle}
                >
                  {el}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
