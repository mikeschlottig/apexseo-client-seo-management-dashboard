import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, GitBranch, BarChart, Settings, LifeBuoy, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useClientStore } from "@/store/client-store";
import { useLeadStore } from "@/store/lead-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/clients", icon: Users, label: "Clients" },
  { to: "/pipeline", icon: GitBranch, label: "Sales Pipeline" },
  { to: "/reports", icon: FileText, label: "Reports" },
];
const disabledNavItems: typeof navItems = [];
export function Sidebar() {
  const clients = useClientStore((state) => state.clients);
  const leads = useLeadStore((state) => state.leads);

  const recentClients = clients.slice(0, 3);
  const newLeadsCount = leads.filter(l => l.stage === 'Lead In').length;

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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                      {item.to === '/pipeline' && newLeadsCount > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {newLeadsCount}
                        </Badge>
                      )}
            </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        ))}

        {recentClients.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Recent
              </p>
              <div className="space-y-1">
                {recentClients.map((client) => (
                  <NavLink
                    key={client.id}
                    to={`/clients/${client.id}`}
                    className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors truncate"
                  >
                    {client.company}
                  </NavLink>
                ))}
              </div>
            </div>
          </>
        )}
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