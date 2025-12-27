import { Client } from "@shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, User, Briefcase, Globe, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
interface ClientInfoCardProps {
  client: Client;
}
const InfoRow = ({ icon: Icon, label, value, clickable, color }: { 
  icon: React.ElementType, 
  label: string, 
  value: string,
  clickable?: boolean,
  color?: string
}) => {
  const handleClick = () => {
    if (clickable) {
      navigator.clipboard.writeText(value);
      toast.success(`${label} copied to clipboard!`);
    }
  };
  return (
    <div className="flex items-start space-x-3">
      <div className={`h-10 w-10 rounded-full ${color || 'bg-primary/10'} flex items-center justify-center flex-shrink-0`}>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <span 
          className={`font-medium ${clickable ? 'cursor-pointer hover:text-primary hover:underline transition-colors' : ''}`}
          onClick={clickable ? handleClick : undefined}
        >
          {value}
        </span>
      </div>
    </div>
  );
};
export function ClientInfoCard({ client }: ClientInfoCardProps) {
  return (
    <Card className="hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <InfoRow icon={Building} label="Company" value={client.company} color="bg-blue-500/10" />
        <InfoRow icon={User} label="Contact Person" value={client.contactPerson} color="bg-green-500/10" />
        <InfoRow icon={Briefcase} label="Industry" value={client.industry} color="bg-purple-500/10" />
        <InfoRow icon={Globe} label="Website" value={client.website} clickable color="bg-orange-500/10" />
        <InfoRow icon={Mail} label="Email" value={client.email} clickable color="bg-red-500/10" />
        <InfoRow icon={Phone} label="Phone" value={client.phone} clickable color="bg-teal-500/10" />
      </CardContent>
    </Card>
  );
}