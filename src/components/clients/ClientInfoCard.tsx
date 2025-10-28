import { Client } from "@shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, User, Briefcase, Globe, Mail, Phone } from "lucide-react";
interface ClientInfoCardProps {
  client: Client;
}
const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div className="flex items-start space-x-3">
    <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  </div>
);
export function ClientInfoCard({ client }: ClientInfoCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow icon={Building} label="Company" value={client.company} />
        <InfoRow icon={User} label="Contact Person" value={client.contactPerson} />
        <InfoRow icon={Briefcase} label="Industry" value={client.industry} />
        <InfoRow icon={Globe} label="Website" value={client.website} />
        <InfoRow icon={Mail} label="Email" value={client.email} />
        <InfoRow icon={Phone} label="Phone" value={client.phone} />
      </CardContent>
    </Card>
  );
}