import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, GitBranch, BarChart, Settings, LifeBuoy } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/clients", icon: Users, label: "Clients" },
  { to: "/pipeline", icon: GitBranch, label: "Sales Pipeline" },
];
const disabledNavItems = [
  { to: "/reports", icon: BarChart, label: "Reports" },
];
export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-muted/40 border-r">
      <div className="flex items-center h-16 px-6 border-b">
        <BarChart className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-xl font-bold font-display" style={{ textShadow: '0 0 20px rgba(30, 64, 175, 0.3)' }}>
          ApexSEO
        </h1>
      </div>
      <nav className="flex-1 py-6 space-y-2 px-4">
        {navItems.map((item) => (
          <motion.div 
            key={item.to} 
            whileHover={{ scale: 1.02 }} 
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm border-l-4 border-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
        {disabledNavItems.map((item) => (
          <TooltipProvider key={item.to}>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-muted-foreground/50 cursor-not-allowed">
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="animate-fade-in">
                <p>Coming Soon!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>
      <Separator className="my-4" />
      <div className="mt-auto p-4 border-t">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
          <NavLink
            to="/settings"
            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            <Settings className="h-5 w-5 mr-3" />
            <span>Settings</span>
          </NavLink>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
          <NavLink
            to="/help"
            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            <LifeBuoy className="h-5 w-5 mr-3" />
            <span>Help & Support</span>
          </NavLink>
        </motion.div>
      </div>
    </aside>
  );
}