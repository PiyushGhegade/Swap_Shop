import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// ✅ Zod schema with string-based categoryId
const listingFormSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  categoryId: z.string().min(1),
  location: z.string().optional(),
  images: z.array(z.string()).min(1),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

interface Category {
  _id: string;
  name: string;
}

interface CreateListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function CreateListingModal({
  open,
  onOpenChange,
}: CreateListingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ Log categories and errors
 // ✅ Replace this block in create-listing-modal.tsx
const {
  data: categories = [],
  isLoading: categoriesLoading,
  error: categoriesError,
} = useQuery<Category[]>({
  queryKey: ["/api/categories"], // matches your route
  queryFn: async () => {
    try {
      console.log("📡 Fetching categories from backend...");
      const res = await apiRequest("GET", "/api/categories");
      const data = await res.json();
      console.log("✅ Categories fetched:", data);
      return data;
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
      throw err;
    }
  },
});




  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      location: "",
      images: [],
    },
  });

  const createListingMutation = useMutation({
  mutationFn: async (values: ListingFormValues) => {
    if (!user) {
      console.error("🚫 You must be logged in to create a listing");
      throw new Error("You must be logged in to create a listing");
    }

    const listingData = {
      ...values,
      category: values.categoryId, // ✅ rename to match backend
      userId: user.id,             // 🔧 used only if backend expects userId directly
    };
    delete listingData.categoryId; // ❌ remove the incompatible key

    console.log("📦 Submitting listing data:", listingData);

    const res = await apiRequest("POST", "/api/listings", listingData);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Listing creation failed:", errorText);
      throw new Error(errorText);
    }

    const data = await res.json();
    console.log("✅ Listing created successfully:", data);
    return data;
  },

  onSuccess: () => {
    toast({
      title: "Listing created",
      description: "Your listing has been successfully created",
    });
    queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
    onOpenChange(false);
    form.reset();
    setUploadedImages([]);
  },

  onError: (error: Error) => {
    console.error("❌ Listing creation error:", error.message);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  },
});


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < e.target.files.length && i < 5; i++) {
        const base64 = await convertToBase64(e.target.files[i]);
        newImages.push(base64);
      }
      const updated = [...uploadedImages, ...newImages].slice(0, 5);
      setUploadedImages(updated);
      form.setValue("images", updated, { shouldValidate: true });
    } catch {
      toast({
        title: "Image Upload Failed",
        description: "Please try again.",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              createListingMutation.mutate(values)
            )}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What are you selling?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
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
                      value={field.value}
                      onValueChange={(val) => {
                        console.log("📌 Selected categoryId:", val);
                        field.onChange(val);
                      }}
                      disabled={categoriesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
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
                    <Textarea
                      rows={4}
                      placeholder="Describe your item"
                      {...field}
                    />
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
                  <FormLabel>Photos</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {uploadedImages.map((img, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={img}
                                alt={`Preview ${idx + 1}`}
                                className="h-20 w-20 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <label className="cursor-pointer flex flex-col items-center justify-center">
                        {isUploading ? (
                          <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                        ) : (
                          <i className="ri-upload-2-line text-2xl text-gray-400 mb-1"></i>
                        )}
                        <span className="text-sm text-gray-500">
                          Click to upload {uploadedImages.length > 0 ? "more " : ""}(max 5)
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={
                            isUploading || uploadedImages.length >= 5
                          }
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
                  <FormLabel>Location on Campus</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Aryabhatta A406" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={createListingMutation.isPending}
            >
              {createListingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
