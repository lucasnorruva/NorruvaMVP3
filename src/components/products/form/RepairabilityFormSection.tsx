
// --- File: RepairabilityFormSection.tsx ---
// Description: Form section component for Repairability and End-of-Life details.
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormData } from "@/components/products/ProductForm";
// AiIndicator and AI helper imports could be added later if AI suggestions for these fields are desired.

interface RepairabilityFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  // initialData?: Partial<InitialProductFormData>; // Not used in this simple version yet
  // isSubmittingForm?: boolean; // Not used in this simple version yet
}

export default function RepairabilityFormSection({
  form,
}: RepairabilityFormSectionProps) {
  return (
    <div className="space-y-6 pt-4">
      <FormDescription>
        Provide information related to the product's repairability and end-of-life management, aligning with ESPR requirements.
      </FormDescription>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="productDetails.repairabilityScore.value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repairability Score Value</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 7.8" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="productDetails.repairabilityScore.scale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repairability Score Scale</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 10" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
              <FormDescription>The maximum value of the repairability score scale (e.g., 10).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
       <FormField
          control={form.control}
          name="productDetails.repairabilityScore.reportUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repairability Score Report URL (Optional)</FormLabel>
              <FormControl><Input type="url" placeholder="https://example.com/repair-report.pdf" {...field} value={field.value || ""} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      
      <FormField
        control={form.control}
        name="productDetails.sparePartsAvailability"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Spare Parts Availability</FormLabel>
            <FormControl><Textarea placeholder="e.g., Up to 7 years from end of sale. Key components (motor, pump) available for 10 years." {...field} value={field.value || ""} rows={2}/></FormControl>
            <FormDescription>Information on the duration for which spare parts are expected to be available.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="productDetails.repairManualUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Repair Manual URL</FormLabel>
            <FormControl><Input type="url" placeholder="https://example.com/manuals/repair_guide.pdf" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Link to the official repair manual for the product.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="productDetails.disassemblyInstructionsUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Disassembly Instructions URL</FormLabel>
            <FormControl><Input type="url" placeholder="https://example.com/manuals/disassembly_guide.pdf" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Link to instructions for safe disassembly, relevant for repair and recycling.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
