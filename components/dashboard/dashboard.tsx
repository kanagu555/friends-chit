"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AdminDashboard as AdminDashboardComponent } from "@/components/admin/admin-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";
import { SchemeDetail } from "@/components/member/scheme-detail";
import { MyContributions } from "@/components/member/my-contributions";
import { DrawHistory } from "@/components/member/draw-history";
import { ChitCalculator } from "@/components/member/chit-calculator";
import { MemberReports } from "@/components/member/member-reports";
import {
  IndianRupee,
  Calendar,
  Activity,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {user.role === "admin" ? (
              <Shield className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            )}
            Welcome, {user.role === "admin" ? "Administrator" : "Member"}
          </CardTitle>
          <CardDescription>Logged in as: {user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
              {user.role.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {user.role === "admin"
                ? "You have full access to manage the chit fund system"
                : "You can view your member information and participate in chit funds"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Role-based Content */}
      {user.role === "admin" ? <AdminDashboard /> : <MemberDashboard />}
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <AdminDashboardComponent />
    </div>
  );
}

function MemberDashboard() {
  const [activeTab, setActiveTab] = useState("scheme");

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Active Chits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Currently participating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,00,000</div>
            <p className="text-xs text-muted-foreground">1 Lakh Chit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Monthly Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹10,000</div>
            <p className="text-xs text-muted-foreground">To be paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Draw Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10th</div>
            <p className="text-xs text-muted-foreground">Every month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-200 rounded-lg p-1">
          <TabsTrigger value="scheme">Scheme Detail</TabsTrigger>
          <TabsTrigger value="draws">Draws</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="scheme">
          <SchemeDetail />
        </TabsContent>

        <TabsContent value="draws">
          <DrawHistory />
        </TabsContent>

        <TabsContent value="reports">
          <MemberReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
