// components/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Upload,
  List,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
  Grid,
  BarChart3,
  User,
  Menu,
  X,
  User2,
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

interface SubItem {
  id: number;
  label: string;
  icon: any;
  href: string;
}

interface MenuItem {
  id: number;
  label: string;
  icon: any;
  href: string;
  subItems?: SubItem[];
}

const menuItems: MenuItem[] = [
  { id: 1, label: "Dashboard", icon: Home, href: "/" },
  {
    id: 2,
    label: "Products",
    icon: Package,
    href: "#",
    subItems: [
      {
        id: 21,
        label: "Upload Products",
        icon: Upload,
        href: "/product/upload",
      },
      {
        id: 22,
        label: "All Products",
        icon: List,
        href: "/all-products",
      },
    ],
  },
  { id: 3, label: "Categories", icon: Grid, href: "/dashboard/categories" },
  { id: 4, label: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
  { id: 5, label: "Users", icon: Users, href: "/dashboard/users" },
  { id: 6, label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
];

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isMobileOpen &&
        !target.closest(".mobile-sidebar") &&
        !target.closest(".mobile-menu-button")
      ) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  const handleToggleSidebar = () => {
    toggleSidebar();
    if (!isCollapsed) {
      setActiveSubMenu(null);
    }
  };

  const toggleSubMenu = (id: number) => {
    setActiveSubMenu(activeSubMenu === id ? null : id);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Mobile Menu Button - Fixed at top */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="mobile-menu-button lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" />
      )}

      {/* Sidebar */}
      <aside
        className={`
        mobile-sidebar
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200
        flex flex-col transition-all duration-300 ease-in-out z-40
        
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        
        ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        w-64
      `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed || isMobileOpen ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">
                Jabotio.com
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <Package className="w-5 h-5 text-white" />
            </div>
          )}

          {/* Desktop Collapse Button */}
          <button
            onClick={handleToggleSidebar}
            className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isItemActive =
                isActive(item.href) ||
                item.subItems?.some((sub) => isActive(sub.href));

              return (
                <li key={item.id}>
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleSubMenu(item.id)}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-lg
                          hover:bg-gray-50 transition-colors
                          ${
                            isItemActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700"
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon
                            className={`w-5 h-5 shrink-0 ${
                              isItemActive ? "text-blue-600" : "text-gray-500"
                            }`}
                          />
                          {(!isCollapsed || isMobileOpen) && (
                            <span>{item.label}</span>
                          )}
                        </div>
                        {(!isCollapsed || isMobileOpen) && (
                          <ChevronRight
                            className={`
                            w-4 h-4 transition-transform
                            ${activeSubMenu === item.id ? "rotate-90" : ""}
                          `}
                          />
                        )}
                      </button>

                      {(!isCollapsed || isMobileOpen) &&
                        activeSubMenu === item.id && (
                          <ul className="ml-10 mt-2 space-y-1">
                            {item.subItems.map((subItem) => {
                              const SubIcon = subItem.icon;
                              const isSubActive = isActive(subItem.href);

                              return (
                                <li key={subItem.id}>
                                  <Link
                                    href={subItem.href}
                                    className={`
                                    flex items-center space-x-3 p-2 rounded-lg
                                    hover:bg-gray-50 transition-colors
                                    ${
                                      isSubActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600"
                                    }
                                  `}
                                  >
                                    <SubIcon className="w-4 h-4" />
                                    <span>{subItem.label}</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`
                        flex items-center space-x-3 p-3 rounded-lg
                        hover:bg-gray-50 transition-colors
                        ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        }
                      `}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 ${
                          isActive(item.href)
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      />
                      {(!isCollapsed || isMobileOpen) && (
                        <span>{item.label}</span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Profile Section - Fixed */}
        <div className="p-4 border-t border-gray-200">
          {!isCollapsed || isMobileOpen ? (
            <Link
              href="/profile"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <User2 />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Admin
                </p>
                <p className="text-xs text-gray-500 truncate">View Profile</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </Link>
          ) : (
            <Link
              href="/profile"
              className="flex items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
