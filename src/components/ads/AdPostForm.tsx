
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Upload, DollarSign, Info, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { products, categories, vendors } from "@/data/mockData";

interface AdPostFormProps {
  onSubmit: () => void;
}

export function AdPostForm({ onSubmit }: AdPostFormProps) {
  const { user } = useAuth();
  const [adType, setAdType] = useState<'product' | 'store' | 'brand' | 'external'>('product');
  const [placement, setPlacement] = useState<'top-vendors' | 'featured-product' | 'ptc'>('top-vendors');
  const [targetId, setTargetId] = useState<string>('');
  const [externalUrl, setExternalUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [budget, setBudget] = useState<string>('10');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload this file to a server
      // For demo purposes, we're just creating a local URL
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };
  
  const isExternalAd = adType === 'external';
  const isPtcAd = placement === 'ptc';
  const needsAdminApproval = isExternalAd;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || (isExternalAd && !externalUrl) || (!isExternalAd && !targetId)) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    // Submit form
    toast({
      title: needsAdminApproval ? "Ad submitted for approval" : "Ad created successfully",
      description: needsAdminApproval 
        ? "Your ad will be reviewed by an admin before it goes live." 
        : "Your ad is now live and will start displaying to users."
    });
    
    onSubmit();
  };
  
  // Pricing information based on ad type and placement
  const getPricingInfo = () => {
    switch (placement) {
      case 'top-vendors':
        return {
          pricePerDay: 2.99,
          description: "Your product appears at the top of the vendors list"
        };
      case 'featured-product':
        return {
          pricePerDay: 4.99,
          description: "Your product is highlighted in relevant categories"
        };
      case 'ptc':
        return {
          pricePerDay: 1.99,
          description: "Users earn rewards for clicking your ad"
        };
    }
  };
  
  const pricingInfo = getPricingInfo();
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Advertisement Type</Label>
          <Select 
            value={adType} 
            onValueChange={(value: 'product' | 'store' | 'brand' | 'external') => setAdType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ad type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">Product Advertisement</SelectItem>
              <SelectItem value="store">Store Advertisement</SelectItem>
              <SelectItem value="brand">Brand Advertisement</SelectItem>
              <SelectItem value="external">External Link Advertisement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Placement</Label>
          <Select 
            value={placement} 
            onValueChange={(value: 'top-vendors' | 'featured-product' | 'ptc') => setPlacement(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select placement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top-vendors">Top of Vendors List</SelectItem>
              <SelectItem value="featured-product">Featured Product</SelectItem>
              <SelectItem value="ptc">Pay-to-Click (PTC) Ad</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            ${pricingInfo.pricePerDay.toFixed(2)} per day - {pricingInfo.description}
          </p>
        </div>
        
        {!isExternalAd && (
          <div className="space-y-2">
            <Label>
              {adType === 'product' ? 'Select Product' : 
               adType === 'store' ? 'Select Store' : 'Select Brand'}
            </Label>
            <Select 
              value={targetId} 
              onValueChange={setTargetId}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select a ${adType}...`} />
              </SelectTrigger>
              <SelectContent>
                {adType === 'product' && products.map(product => (
                  <SelectItem key={String(product.id)} value={String(product.id)}>
                    {product.name}
                  </SelectItem>
                ))}
                {adType === 'store' && vendors.map(vendor => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
                {adType === 'brand' && [
                  { id: 'b1', name: 'Apple' },
                  { id: 'b2', name: 'Samsung' },
                  { id: 'b3', name: 'Sony' },
                  { id: 'b4', name: 'LG' },
                  { id: 'b5', name: 'Dell' }
                ].map(brand => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {isExternalAd && (
          <div className="space-y-2">
            <Label htmlFor="externalUrl">External URL</Label>
            <Input
              id="externalUrl"
              placeholder="https://example.com"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
            />
            
            {needsAdminApproval && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-amber-700">
                    External ads require admin approval before going live.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="title">Ad Title</Label>
          <Input
            id="title"
            placeholder="Enter a compelling title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Ad Description</Label>
          <Textarea
            id="description"
            placeholder="Enter a brief description..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        {isPtcAd && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="adImage">Ad Image</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" type="button">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-sm">
                      For PTC ads, an eye-catching image is recommended
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center gap-4">
              {previewImage ? (
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Ad preview" 
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={() => setPreviewImage(null)}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-md border-muted-foreground/25 cursor-pointer">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="budget">Daily Budget</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" type="button">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-sm">
                    The maximum amount you're willing to spend per day
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="budget"
              type="number"
              min="5"
              step="0.01"
              className="pl-9"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Minimum budget: $5.00 per day
          </p>
        </div>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Ad Summary</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Type:</dt>
                <dd className="font-medium">{adType.charAt(0).toUpperCase() + adType.slice(1)} Advertisement</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Placement:</dt>
                <dd className="font-medium">
                  {placement === 'top-vendors' && 'Top of Vendors List'}
                  {placement === 'featured-product' && 'Featured Product'}
                  {placement === 'ptc' && 'Pay-to-Click (PTC) Ad'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Daily Cost:</dt>
                <dd className="font-medium">${pricingInfo.pricePerDay.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Daily Budget:</dt>
                <dd className="font-medium">${parseFloat(budget).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status:</dt>
                <dd className="font-medium">{needsAdminApproval ? 'Pending Approval' : 'Ready to Launch'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button type="submit" className="w-full sm:w-auto">
          {needsAdminApproval ? 'Submit for Approval' : 'Create Advertisement'}
        </Button>
      </div>
    </form>
  );
}
