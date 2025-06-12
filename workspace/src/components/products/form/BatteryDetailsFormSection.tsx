
// --- File: BatteryDetailsFormSection.tsx ---
// Description: Form section component for battery-specific details in the product form.
"use client";

import React, { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AiIndicator from "./AiIndicator";
import type { ProductFormData } from "@/components/products/ProductForm";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import type { SuggestBatteryDetailsOutput } from "@/ai/flows/suggest-battery-details-flow";
import { handleSuggestBatteryDetailsAI } from "@/utils/aiFormHelpers"; // Import the new helper
import type { ToastInput } from "@/hooks/use-toast";
import { Sparkles, Loader2, AlertTriangle, PlusCircle, Trash2 } from "lucide-react";
import type { BatteryRegulationDetails, CarbonFootprintData, StateOfHealthData, RecycledContentData } from "@/types/dpp";

type ToastFn = (input: ToastInput) => void;

interface BatteryDetailsFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  isSubmittingForm?: boolean;
  toast: ToastFn;
}

export default function BatteryDetailsFormSection({ form, initialData, isSubmittingForm, toast }: BatteryDetailsFormSectionProps) {
  const [isSuggestingBatteryDetailsInternal, setIsSuggestingBatteryDetailsInternal] = useState(false);

  const { fields: recycledContentFields, append: appendRecycledContent, remove: removeRecycledContent } = useFieldArray({
    control: form.control,
    name: "batteryRegulation.recycledContent",
  });

  const callSuggestBatteryDetailsAIInternal = async () => {
    const result = await handleSuggestBatteryDetailsAI(form, toast, setIsSuggestingBatteryDetailsInternal);
    if (result) {
      let suggestionsMade = false;
      const originPath = "batteryRegulationOrigin";

      if (result.suggestedBatteryChemistry) {
        form.setValue("batteryRegulation.batteryChemistry", result.suggestedBatteryChemistry, { shouldValidate: true });
        form.setValue(`${originPath}.batteryChemistryOrigin` as any, 'AI_EXTRACTED');
        suggestionsMade = true;
      }
      if (result.suggestedBatteryPassportId) {
        form.setValue("batteryRegulation.batteryPassportId", result.suggestedBatteryPassportId, { shouldValidate: true });
        form.setValue(`${originPath}.batteryPassportIdOrigin` as any, 'AI_EXTRACTED');
        suggestionsMade = true;
      }
      if (result.suggestedBatteryRegulationVcId) {
        form.setValue("batteryRegulation.vcId", result.suggestedBatteryRegulationVcId, { shouldValidate: true });
        form.setValue(`${originPath}.vcIdOrigin` as any, 'AI_EXTRACTED');
        suggestionsMade = true;
      }

      if (result.suggestedCarbonFootprint) {
        if (result.suggestedCarbonFootprint.value !== undefined) {
          form.setValue("batteryRegulation.carbonFootprint.value", result.suggestedCarbonFootprint.value, { shouldValidate: true });
          form.setValue(`${originPath}.carbonFootprintOrigin.valueOrigin` as any, 'AI_EXTRACTED');
          suggestionsMade = true;
        }
        if (result.suggestedCarbonFootprint.unit) {
          form.setValue("batteryRegulation.carbonFootprint.unit", result.suggestedCarbonFootprint.unit, { shouldValidate: true });
          form.setValue(`${originPath}.carbonFootprintOrigin.unitOrigin` as any, 'AI_EXTRACTED');
          suggestionsMade = true;
        }
        if (result.suggestedCarbonFootprint.calculationMethod) {
          form.setValue("batteryRegulation.carbonFootprint.calculationMethod", result.suggestedCarbonFootprint.calculationMethod, { shouldValidate: true });
          form.setValue(`${originPath}.carbonFootprintOrigin.calculationMethodOrigin` as any, 'AI_EXTRACTED');
          suggestionsMade = true;
        }
      }

      if (result.suggestedStateOfHealth) {
        if (result.suggestedStateOfHealth.value !== undefined) {
          form.setValue("batteryRegulation.stateOfHealth.value", result.suggestedStateOfHealth.value, { shouldValidate: true });
          form.setValue(`${originPath}.stateOfHealthOrigin.valueOrigin` as any, 'AI_EXTRACTED');
          suggestionsMade = true;
        }
        if (result.suggestedStateOfHealth.unit) {
          form.setValue("batteryRegulation.stateOfHealth.unit", result.suggestedStateOfHealth.unit, { shouldValidate: true });
          form.setValue(`${originPath}.stateOfHealthOrigin.unitOrigin` as any, 'AI_EXTRACTED');
          suggestionsMade = true;
        }
        if (result.suggestedStateOfHealth.measurementDate) {
          form.setValue("batteryRegulation.stateOfHealth.measurementDate", result.suggestedStateOfHealth.measurementDate, { shouldValidate: true });
          form.setValue(`${originPath}.stateOfHealthOrigin.measurementDateOrigin` as any, 'AI_EXTRACTED');
          suggestionsMade = true;
        }
      }
      
      if (result.suggestedRecycledContent && result.suggestedRecycledContent.length > 0) {
        // Clear existing AI suggested recycled content before appending new ones to avoid duplicates from multiple suggestions
        // Or, more robustly, merge based on material if AI might suggest updates to existing ones.
        // For now, simple append:
        const currentRecycledContentLength = form.getValues("batteryRegulation.recycledContent")?.length || 0;
        result.suggestedRecycledContent.forEach((rc, index) => {
          if (rc.material && rc.percentage !== undefined) {
            appendRecycledContent({ material: rc.material, percentage: rc.percentage, vcId: "" });
            const newIndex = currentRecycledContentLength + index;
            form.setValue(`${originPath}.recycledContentOrigin.${newIndex}.materialOrigin` as any, 'AI_EXTRACTED');
            form.setValue(`${originPath}.recycledContentOrigin.${newIndex}.percentageOrigin` as any, 'AI_EXTRACTED');
            suggestionsMade = true;
          }
        });
      }
      
      if (!suggestionsMade) {
         toast({ title: "No Specific Battery Details Suggested", description: "AI could not find specific battery details to suggest based on current product info. You can still fill them manually.", variant: "default" });
      }
    }
  };


  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Provide detailed battery information as per EU Battery Regulation. Fields are optional.</p>
        <Button type="button" variant="ghost" size="sm" onClick={callSuggestBatteryDetailsAIInternal} disabled={isSuggestingBatteryDetailsInternal || !!isSubmittingForm}>
            {isSuggestingBatteryDetailsInternal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
            <span className="ml-2">{isSuggestingBatteryDetailsInternal ? "Suggesting..." : "Suggest Battery Details"}</span>
        </Button>
      </div>

      <FormField
        control={form.control}
        name="batteryRegulation.batteryChemistry"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Battery Chemistry
              <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.batteryChemistryOrigin} fieldName="Battery Chemistry" />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Li-ion NMC, LFP"
                {...field}
                onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.batteryChemistryOrigin" as any, "manual"); }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="batteryRegulation.batteryPassportId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">Battery Passport ID (Optional)
              <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.batteryPassportIdOrigin} fieldName="Battery Passport ID" />
            </FormLabel>
            <FormControl><Input placeholder="Unique ID for the battery passport itself" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.batteryPassportIdOrigin" as any, "manual"); }} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="batteryRegulation.vcId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">Overall Battery Regulation VC ID (Optional)
              <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.vcIdOrigin} fieldName="Overall Battery VC ID" />
            </FormLabel>
            <FormControl><Input placeholder="Verifiable Credential ID for overall compliance" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.vcIdOrigin" as any, "manual"); }} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Carbon Footprint Section */}
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">Manufacturing Carbon Footprint</h4>
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">Value
                <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.carbonFootprintOrigin?.valueOrigin} fieldName="CF Value" />
              </FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 85.5" {...field} onChange={e => { field.onChange(e.target.value === '' ? null : e.target.valueAsNumber); form.setValue("batteryRegulationOrigin.carbonFootprintOrigin.valueOrigin" as any, "manual"); }} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.unit"
          render={({ field }) => (
            <FormItem><FormLabel className="flex items-center">Unit<AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.carbonFootprintOrigin?.unitOrigin} fieldName="CF Unit" /></FormLabel>
            <FormControl><Input placeholder="e.g., kg CO2e/kWh" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.carbonFootprintOrigin.unitOrigin" as any, "manual"); }} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.calculationMethod"
          render={({ field }) => (
            <FormItem><FormLabel className="flex items-center">Calculation Method<AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.carbonFootprintOrigin?.calculationMethodOrigin} fieldName="CF Method" /></FormLabel>
            <FormControl><Input placeholder="e.g., PEFCR for Batteries v1.2" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.carbonFootprintOrigin.calculationMethodOrigin" as any, "manual"); }} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.vcId"
          render={({ field }) => (
            <FormItem><FormLabel>Carbon Footprint VC ID (Optional)</FormLabel><FormControl><Input placeholder="VC ID for carbon footprint data" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
      </div>

      {/* State of Health Section */}
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">State of Health (SoH)</h4>
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">Value
                <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.stateOfHealthOrigin?.valueOrigin} fieldName="SoH Value" />
              </FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 100 (for new)" {...field} onChange={e => { field.onChange(e.target.value === '' ? null : e.target.valueAsNumber); form.setValue("batteryRegulationOrigin.stateOfHealthOrigin.valueOrigin" as any, "manual"); }} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.unit"
          render={({ field }) => (
            <FormItem><FormLabel className="flex items-center">Unit<AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.stateOfHealthOrigin?.unitOrigin} fieldName="SoH Unit" /></FormLabel>
            <FormControl><Input placeholder="e.g., %" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.stateOfHealthOrigin.unitOrigin" as any, "manual"); }} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.measurementDate"
          render={({ field }) => (
            <FormItem><FormLabel className="flex items-center">Measurement Date<AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.stateOfHealthOrigin?.measurementDateOrigin} fieldName="SoH Date" /></FormLabel>
            <FormControl><Input type="date" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.stateOfHealthOrigin.measurementDateOrigin" as any, "manual"); }} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.vcId"
          render={({ field }) => (
            <FormItem><FormLabel>State of Health VC ID (Optional)</FormLabel><FormControl><Input placeholder="VC ID for SoH data" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
      </div>

      {/* Recycled Content Section */}
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">Recycled Content in Active Materials</h4>
        {recycledContentFields.map((item, index) => (
          <div key={item.id} className="p-3 border rounded-md bg-background space-y-2 relative">
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.material`}
              render={({ field }) => (
                <FormItem><FormLabel className="flex items-center">Material
                  <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.recycledContentOrigin?.[index]?.materialOrigin} fieldName={`Material #${index + 1}`} />
                </FormLabel><FormControl><Input placeholder="e.g., Cobalt, Lithium, Nickel, Lead" {...field} onChange={(e) => { field.onChange(e); form.setValue(`batteryRegulationOrigin.recycledContentOrigin.${index}.materialOrigin` as any, "manual"); }} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.percentage`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">Percentage (%)
                    <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.recycledContentOrigin?.[index]?.percentageOrigin} fieldName={`Recycled Content % #${index + 1}`} />
                  </FormLabel>
                  <FormControl><Input type="number" placeholder="e.g., 16" {...field} onChange={e => { field.onChange(e.target.value === '' ? null : e.target.valueAsNumber); form.setValue(`batteryRegulationOrigin.recycledContentOrigin.${index}.percentageOrigin` as any, "manual"); }} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.vcId`}
              render={({ field }) => (
                <FormItem><FormLabel>VC ID for this material (Optional)</FormLabel><FormControl><Input placeholder="VC ID for specific recycled material claim" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 text-destructive" onClick={() => removeRecycledContent(index)} title="Remove this material">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => appendRecycledContent({ material: "", percentage: null, vcId: "" })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Material for Recycled Content
        </Button>
      </div>

    </div>
  );
}
