import { useRef, useState } from "react";
import { User } from "@/types/user";


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface ProfileInfoProps {
  user: Partial<User> & { id: string };
}

type ProfileFormValues = {
  displayName?: string;
  phone?: string;
  hostel?: string;
  roomNumber?: string;
  avatar?: string; // base64
};

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user || !user.username) {
    return <div className="text-red-600 font-semibold">⚠️ User data missing or incomplete</div>;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      displayName: user.displayName || user.name || "",
      phone: user.phone || "",
      hostel: user.hostel || "",
      roomNumber: user.roomNumber || "",
      avatar: user.avatar || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const res = await apiRequest("PATCH", `/api/users/${user.id}`, values);
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: (updatedUser) => {
      toast({ title: "✅ Profile updated", description: "Your profile has been updated." });

      // ✅ Update avatar preview immediately
      setAvatarPreview(updatedUser.avatar || "");

      // ✅ Refresh cached user
      queryClient.setQueryData(["/api/user"], updatedUser);

    setIsEditing(false);
    }
    ,
    onError: (error: Error) => {
      toast({ title: "❌ Update failed", description: error.message, variant: "destructive" });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

      if (file.size > MAX_SIZE_BYTES) {
        toast({
          title: "🚫 Image too large",
          description: `Image must be less than ${MAX_SIZE_MB}MB.`,
          variant: "destructive"
        });
        return;
      }


    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setAvatarPreview(base64);
      setValue("avatar", base64, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: ProfileFormValues) => {
    console.log("📝 Submitting profile update:", data);
    updateProfileMutation.mutate(data);

  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-medium">Profile Information</h2>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <Button variant="ghost" onClick={() => { reset(); setIsEditing(false); }}>Cancel</Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Picture (max 5MB)</Label>

              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback>{user.username?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input id="displayName" {...register("displayName")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...register("phone")} placeholder="Optional" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hostel">Hostel</Label>
              <Input id="hostel" {...register("hostel")} placeholder="Optional" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input id="roomNumber" {...register("roomNumber")} placeholder="Optional" />
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-40 w-40">

                <AvatarImage src={user.avatar || avatarPreview || ""} />
                <AvatarFallback className="text-lg">
                  {(user.displayName || user.username || "U")?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>


              <div className="space-y-1">
                <p className="font-semibold text-lg">{user.displayName || user.name}</p>
                <p className="text-gray-600">@{user.username}</p>
                <p className="text-gray-600">📧 {user.email}</p>
                <p className="text-gray-600">🎓 Roll No: {user.rollno}</p>
                {user.phone && <p className="text-gray-600">📞 Phone: {user.phone}</p>}
                {user.hostel && <p className="text-gray-600">🏢 Hostel: {user.hostel}</p>}
                {user.roomNumber && <p className="text-gray-600">🛏️ Room: {user.roomNumber}</p>}
                {user.createdAt && (
                  <p className="text-gray-600">
                    🕒 Member Since: {new Date(user.createdAt).toLocaleString()}
                  </p>
                )}
              </div>

            </div>

            <div className="grid gap-4 pt-4 border-t border-gray-100">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
                <p>{user.createdAt ? new Date(user.createdAt).toLocaleString() : "Unknown"}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
