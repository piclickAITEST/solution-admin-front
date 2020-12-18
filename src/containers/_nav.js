const Nav = [
  {
    _tag: "CSidebarNavDropdown",
    name: "품절대체",
    icon: "cil3d",
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "품절 목록",
        to: "/soldout",
      },
      {
        _tag: "CSidebarNavItem",
        name: "품절대체 통계",
        to: "/soldout/report",
      },
    ],
  },
];

export default Nav;
