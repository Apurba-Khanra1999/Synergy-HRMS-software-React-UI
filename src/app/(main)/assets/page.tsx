
"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockAssets, mockEmployees } from "@/lib/data";
import { format } from "date-fns";
import { Laptop, Smartphone, PlusCircle, Pen, Undo2, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Asset, Employee } from "@/types";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const departments = [...new Set(mockEmployees.map((e) => e.department))];

function IssueAssetDialog({ onIssue }: { onIssue: (assetId: string, employeeId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | undefined>();
  const [selectedDepartment, setSelectedDepartment] = useState<Employee['department'] | undefined>();
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>();

  const availableAssets = mockAssets.filter(a => a.status === 'Available');
  
  const filteredEmployees = useMemo(() => {
    if (!selectedDepartment) return [];
    return mockEmployees.filter(emp => emp.department === selectedDepartment);
  }, [selectedDepartment]);

  const handleSubmit = () => {
    if (selectedAsset && selectedEmployee) {
      onIssue(selectedAsset, selectedEmployee);
      setIsOpen(false);
      setSelectedAsset(undefined);
      setSelectedDepartment(undefined);
      setSelectedEmployee(undefined);
    }
  };
  
  const handleDepartmentChange = (dept: Employee['department']) => {
      setSelectedDepartment(dept);
      setSelectedEmployee(undefined);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Issue Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Issue New Asset</DialogTitle>
          <DialogDescription>Assign an available asset to an employee.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="asset">Asset</Label>
            <Select onValueChange={setSelectedAsset}>
              <SelectTrigger id="asset">
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                {availableAssets.map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name} ({asset.serialNumber}) - <span className="text-muted-foreground">{asset.condition}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select onValueChange={handleDepartmentChange}>
                <SelectTrigger id="department">
                    <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                    {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Select onValueChange={setSelectedEmployee} value={selectedEmployee} disabled={!selectedDepartment}>
              <SelectTrigger id="employee">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {filteredEmployees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Issue Asset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReturnAssetDialog({ asset, onReturn }: { asset: Asset, onReturn: (assetId: string, newCondition: Asset['condition']) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [condition, setCondition] = useState<Asset['condition']>(asset.condition);
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onReturn(asset.id, condition);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Undo2 className="mr-2 h-4 w-4" />
          Return
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Return Asset: {asset.name}</DialogTitle>
          <DialogDescription>
            Update the asset's condition upon return. This will make the asset available again.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={condition} onValueChange={(value: Asset['condition']) => setCondition(value)}>
              <SelectTrigger id="condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
              <Label htmlFor="reason">Reason for Return</Label>
              <Textarea id="reason" placeholder="e.g., Employee departure, hardware upgrade..." value={reason} onChange={(e) => setReason(e.target.value)} />
           </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Confirm Return</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function AssetManagementPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const handleIssueAsset = (assetId: string, employeeId: string) => {
    setAssets(assets.map(asset => 
      asset.id === assetId 
        ? { ...asset, status: 'Assigned', assignedTo: employeeId, dateAssigned: new Date() } 
        : asset
    ));
    toast({
      title: "Asset Issued",
      description: "The asset has been successfully assigned to the employee."
    });
  };

  const handleReturnAsset = (assetId: string, newCondition: Asset['condition']) => {
    setAssets(assets.map(asset => 
      asset.id === assetId
        ? { ...asset, status: 'Available', assignedTo: undefined, dateAssigned: undefined, condition: newCondition }
        : asset
    ));
    toast({
        title: "Asset Returned",
        description: "The asset has been returned and is now available."
    });
  };

  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        const term = searchTerm.toLowerCase();
        return (
          asset.name.toLowerCase().includes(term) ||
          asset.serialNumber.toLowerCase().includes(term)
        );
      })
      .filter(
        (asset) => conditionFilter === "all" || asset.condition === conditionFilter
      )
      .filter((asset) => statusFilter === "all" || asset.status === statusFilter);
  }, [assets, searchTerm, conditionFilter, statusFilter]);
  
  const resetFilters = () => {
    setSearchTerm("");
    setConditionFilter("all");
    setStatusFilter("all");
  };

  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return 'N/A';
    return mockEmployees.find(e => e.id === employeeId)?.name || 'Unknown';
  };

  const getStatusBadgeVariant = (status: Asset['status']) => {
    switch (status) {
      case 'Available': return 'bg-green-500/20 text-green-700 border-green-500/20';
      case 'Assigned': return 'bg-blue-500/20 text-blue-700 border-blue-500/20';
      case 'In Repair': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/20';
      case 'Retired': return 'bg-gray-500/20 text-gray-700 border-gray-500/20';
      default: return 'secondary';
    }
  }

  const getAssetIcon = (type: Asset['type']) => {
    switch(type) {
      case 'Laptop': return <Laptop className="h-5 w-5 text-muted-foreground" />;
      case 'Phone': return <Smartphone className="h-5 w-5 text-muted-foreground" />;
      default: return <Pen className="h-5 w-5 text-muted-foreground" />;
    }
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Asset Management"
        description="Track and manage all company-issued assets."
        actions={<IssueAssetDialog onIssue={handleIssueAsset} />}
      />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
           <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or serial..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
           <Select value={conditionFilter} onValueChange={setConditionFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
           <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="In Repair">In Repair</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" onClick={resetFilters}>Reset</Button>
        </div>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date Assigned</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getAssetIcon(asset.type)}
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.type}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{asset.serialNumber}</TableCell>
                  <TableCell>{getEmployeeName(asset.assignedTo)}</TableCell>
                  <TableCell>
                    {asset.dateAssigned ? format(asset.dateAssigned, "MMM d, yyyy") : 'N/A'}
                  </TableCell>
                   <TableCell>
                     <Badge variant="outline">{asset.condition}</Badge>
                   </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeVariant(asset.status)}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {asset.status === 'Assigned' && <ReturnAssetDialog asset={asset} onReturn={handleReturnAsset} />}
                  </TableCell>
                </TableRow>
              ))}
              {filteredAssets.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No assets found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
