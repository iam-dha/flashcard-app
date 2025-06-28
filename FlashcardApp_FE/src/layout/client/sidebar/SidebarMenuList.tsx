import { SidebarContent, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { routes } from "@/routes/router";
import React from "react";
import { NavLink } from "react-router-dom";

const sidebarItemActiveStyles = "rounded-lg font-bold text-foreground rounded-full border border-white/20 bg-blue-300/40 backdrop-blur-xl transition-all duration-300 hover:scale-102 hover:bg-blue-300/20 shadow-sm";
const sidebarItemHoverStyles = "rounded-lg hover:scale-102 hover:bg-blue-300/20 transition-all duration-300";

export default function SidebarMenuList() {
  const sidebarItems = routes.filter((route) => route.showInSidebar);

  return (
    <SidebarContent>
      <SidebarMenu className="p-2">
        {sidebarItems.map((route) => (
          <NavLink key={route.path} to={route.path} className={({ isActive }) => (isActive ? sidebarItemActiveStyles : sidebarItemHoverStyles)}>
            {({ isActive }) => (
              <SidebarMenuItem className=" flex items-center gap-2 p-2 text-md hover:rounded-lg">
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
