import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import axios from "axios";

// Zod Schema
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
targetUrl: z.string().url("Target URL must be a valid URL").min(1, "Target URL is required"),
  targetType: z.enum(["product", "category", "brand", "external", "none"]),
  priority: z.coerce.number().min(1, "Priority must be at least 1"),
  isActive: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  image: z.any().refine((val) => !!val, "Image is required"),
});

export function CreateBanner() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      targetUrl: "",
      targetType: "none",
      priority: 1,
      isActive: true,
      startDate: "",
      endDate: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    const formData = new FormData();

    try {
      Object.keys(values).forEach((key) => {
        if (key !== "image") {
          formData.append(key, values[key]);
        }
      });

      if (values.image && values.image[0]) {
        formData.append("image", values.image[0]);
      }

      const response = await axios.post(
        "http://localhost:3000/api/v1/banner/create-banner",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Banner Created:", response.data);
      // Optionally reset form
      form.reset();
    } catch (error) {
      console.error("Error creating banner:", error.response?.data || error.message);
    } finally {
      setLoading(false); // always run
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter banner title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Target URL */}
          <FormField
            control={form.control}
            name="targetUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Target URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Target Type */}
          <FormField
            control={form.control}
            name="targetType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Target Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">{field.value}</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* isActive */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <span>{field.value ? "Active" : "Inactive"}</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Banner Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="mt-4" disabled={loading}>
          {loading ? "Creating..." : "Create Banner"}
        </Button>
      </form>
    </Form>
  );
}
