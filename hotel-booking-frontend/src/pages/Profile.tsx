import { useEffect } from "react";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import PageContainer from "../components/PageContainer";
import useAppContext from "../hooks/useAppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import {
  UserCircle,
  Phone,
  MapPin,
  Shield,
  Loader2,
  Save,
} from "lucide-react";

type ProfileForm = {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const Profile = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser,
  );

  const profileForm = useForm<ProfileForm>();
  const passwordForm = useForm<PasswordForm>();

  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        phone: currentUser.phone || "",
        street: currentUser.address?.street || "",
        city: currentUser.address?.city || "",
        state: currentUser.address?.state || "",
        country: currentUser.address?.country || "",
        zipCode: currentUser.address?.zipCode || "",
      });
    }
  }, [currentUser, profileForm]);

  const saveProfile = useMutation(apiClient.updateCurrentUser, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("fetchCurrentUser");
      showToast({
        title: "Profile Updated",
        description: "Your details were saved successfully.",
        type: "SUCCESS",
      });
    },
    onError: () => {
      showToast({
        title: "Update Failed",
        description: "Could not save your profile. Please try again.",
        type: "ERROR",
      });
    },
  });

  const changePwd = useMutation(apiClient.changePassword, {
    onSuccess: () => {
      passwordForm.reset();
      showToast({
        title: "Password Changed",
        description: "Use your new password next time you sign in.",
        type: "SUCCESS",
      });
    },
    onError: (error: unknown) => {
      const message =
        (
          error as { response?: { data?: { message?: string } } }
        )?.response?.data?.message || "Could not change password.";
      showToast({
        title: "Password Change Failed",
        description: message,
        type: "ERROR",
      });
    },
  });

  const onProfileSubmit = profileForm.handleSubmit((values) => {
    saveProfile.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        country: values.country,
        zipCode: values.zipCode,
      },
    });
  });

  const onPasswordSubmit = passwordForm.handleSubmit((values) => {
    if (values.newPassword !== values.confirmPassword) {
      showToast({
        title: "Passwords Don't Match",
        description: "New password and confirmation must be identical.",
        type: "ERROR",
      });
      return;
    }
    changePwd.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  });

  if (isLoading || !currentUser) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </PageContainer>
    );
  }

  const fieldClass = "bg-white";
  const inputSection = "space-y-2";

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white shadow-lg">
          <h1 className="text-2xl md:text-3xl font-medium flex items-center gap-2">
            <UserCircle className="h-7 w-7" />
            Profile &amp; Settings
          </h1>
          <p className="mt-1 text-blue-100">
            Manage your personal details and account security
          </p>
        </div>

        {/* Personal details */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg font-medium text-gray-700">
              <UserCircle className="w-5 h-5 text-primary-600" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={inputSection}>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...profileForm.register("firstName", { required: true })}
                    className={fieldClass}
                  />
                </div>
                <div className={inputSection}>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...profileForm.register("lastName", { required: true })}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className={inputSection}>
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Email (read-only)
                </Label>
                <Input
                  id="email"
                  value={currentUser.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className={inputSection}>
                <Label htmlFor="phone" className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone
                </Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  {...profileForm.register("phone")}
                  className={fieldClass}
                />
              </div>

              <Separator />

              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" /> Address
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={inputSection}>
                    <Label htmlFor="street">Street</Label>
                    <Input
                      id="street"
                      {...profileForm.register("street")}
                      className={fieldClass}
                    />
                  </div>
                  <div className={inputSection}>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...profileForm.register("city")}
                      className={fieldClass}
                    />
                  </div>
                  <div className={inputSection}>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      {...profileForm.register("state")}
                      className={fieldClass}
                    />
                  </div>
                  <div className={inputSection}>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      {...profileForm.register("country")}
                      className={fieldClass}
                    />
                  </div>
                  <div className={inputSection}>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      {...profileForm.register("zipCode")}
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={saveProfile.isLoading}
                className="bg-primary-600 hover:bg-primary-700"
              >
                {saveProfile.isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password */}
        <Card className="shadow-lg border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg font-medium text-gray-700">
                <Shield className="w-5 h-5 text-primary-600" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onPasswordSubmit} className="space-y-4">
                <div className={inputSection}>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    {...passwordForm.register("currentPassword", {
                      required: true,
                    })}
                    className={fieldClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={inputSection}>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      autoComplete="new-password"
                      {...passwordForm.register("newPassword", {
                        required: true,
                        minLength: 6,
                      })}
                      className={fieldClass}
                    />
                  </div>
                  <div className={inputSection}>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      {...passwordForm.register("confirmPassword", {
                        required: true,
                      })}
                      className={fieldClass}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={changePwd.isLoading}
                >
                  {changePwd.isLoading && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
      </div>
    </PageContainer>
  );
};

export default Profile;
