import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Category } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const listingFormSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  categoryId: z.string().min(1),
  location: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required")
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

export default function CreateListingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/categories");
      return res.json();
    },
  });

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      location: "",
      categoryId: "",
      images: []
    }
  });

  const createListingMutation = useMutation({
    mutationFn: async (values: ListingFormValues) => {
      if (!user) throw new Error("You must be logged in to create a listing");
      const listingData = {
        ...values,
        categoryId: values.categoryId,
        userId: user.id
      };
      const res = await apiRequest("POST", "/api/listings", listingData);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Listing created",
        description: "Your listing has been successfully created",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
      navigate(`/listing/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating listing",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB
    setIsUploading(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < e.target.files.length && i < 5; i++) {
        const file = e.target.files[i];
        if (file.size > MAX_IMAGE_SIZE) {
          toast({
            title: "Image too large",
            description: "Each image must be less than 1MB",
            variant: "destructive",
          });
          continue;
        }
        const base64 = await convertToBase64(file);
        if (!uploadedImages.includes(base64)) {
          newImages.push(base64);
        }
      }
      const updatedImages = [...uploadedImages, ...newImages].slice(0, 5);
      setUploadedImages(updatedImages);
      form.setValue("images", updatedImages, { shouldValidate: true });
    } catch {
      toast({
        title: "Error uploading images",
        description: "There was a problem uploading your images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    form.setValue("images", newImages, { shouldValidate: true });
  };

  const onSubmit = (values: ListingFormValues) => {
    createListingMutation.mutate(values);
  };

  if (!user) {
    return <div className="text-center py-20 text-gray-500">You must be logged in to create a listing.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="What are you selling?" maxLength={100} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={categoriesLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories && categories.length > 0 ? (
                            categories.map((category) => (
                              <SelectItem key={category._id} value={category._id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="loading">
                              Loading categories...
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={6} placeholder="Describe your item..." maxLength={1000} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Photos (Required)</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {uploadedImages.length > 0 && (
                          <div className="flex flex-wrap gap-3 mb-4">
                            {uploadedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img src={image} alt={`Preview ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <label className="cursor-pointer flex flex-col items-center justify-center py-4">
                          {isUploading ? (
                            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                          ) : (
                            <i className="ri-upload-2-line text-3xl text-gray-400 mb-2"></i>
                          )}
                          <span className="text-sm text-gray-500 mb-1">
                            Click to upload {uploadedImages.length > 0 ? "more " : ""}photos
                          </span>
                          <span className="text-xs text-gray-400">(max 5 photos)</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploadedImages.length >= 5 || isUploading}
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location on Campus (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Aryabhatta A406" maxLength={100} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createListingMutation.isPending}>
                  {createListingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Listing"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
