import { ArrowLeft, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import avatarImage from "@/assets/avatar-male.png";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function EditProfileForm() {
  return <AppProviders><EditProfileFormInner /></AppProviders>;
}

function EditProfileFormInner() {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: user, isLoading } = trpc.user.me.useQuery(undefined, {
    retry: false,
  });
  const updateMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
      window.history.back();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(avatarImage);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      if (user.avatarUrl) {
        setAvatarPreview(user.avatarUrl);
      }
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateMutation.mutate({
      name: name || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="p-5 space-y-6">
        <div className="sticky top-0 bg-background z-10 px-4 py-4 border-b border-border flex items-center justify-between">
          <div className="w-10" />
          <h1 className="text-lg font-semibold text-foreground">Edit Profile</h1>
          <div className="w-10" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="w-16 h-4 bg-muted rounded animate-pulse" />
              <div className="w-full h-12 bg-muted rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 px-4 py-4 border-b border-border flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Edit Profile</h1>
        <div className="w-10" />
      </div>

      <div className="p-5 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-secondary">
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center ring-2 ring-card cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Camera className="w-4 h-4 text-primary-foreground" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">Tap to change photo</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-muted-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-card border-border rounded-xl h-12"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-card border-border rounded-xl h-12 opacity-60"
              placeholder="Your email"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="w-full h-12 rounded-xl text-base font-semibold"
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </>
  );
}
