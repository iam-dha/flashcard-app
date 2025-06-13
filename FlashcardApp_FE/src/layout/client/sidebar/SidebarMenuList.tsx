import { SidebarContent, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { routes } from "@/routes/router";
import React from "react";
import { NavLink } from "react-router-dom";

const sidebarItemActiveStyles = "rounded-lg bg-sidebar-accent font-bold";
const sidebarItemHoverStyles = "rounded-lg transition-colors duration-200";

export default function SidebarMenuList() {
  const sidebarItems = routes.filter((route) => route.showInSidebar);

  return (
    <SidebarContent>
      <SidebarMenu className="p-2">
        {sidebarItems.map((route) => (
          <NavLink key={route.path} to={route.path} className={({ isActive }) => (isActive ? sidebarItemActiveStyles : sidebarItemHoverStyles)}>
            {({ isActive }) => (
              <SidebarMenuItem className="hover:bg-sidebar-accent/50 flex items-center gap-2 p-2 text-md hover:rounded-lg">
                {route.icon &&
                  React.cloneElement(route.icon as React.ReactElement<{ className?: string }>, {
                    className: isActive ? "stroke-[2.5px] h-6 w-6" : "stroke-[2px] h-6 w-6",
                  })}
                <span className="select-none">{route.title}</span>
              </SidebarMenuItem>
            )}
          </NavLink>
        ))}
      </SidebarMenu>
    </SidebarContent>
  );
}
