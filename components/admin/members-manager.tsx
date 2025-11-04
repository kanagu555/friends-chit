"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMembers } from "@/hooks/use-members";
import { MemberInsert } from "@/lib/supabase";
import { Loader2, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function MembersManager() {
  const { members, loading, error, addMember, updateMember, deleteMember } =
    useMembers();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cycles: 1,
    status: "active" as "active" | "inactive",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingMember) {
        const result = await updateMember(editingMember, formData);
        if (result.success) {
          toast({
            title: "Success",
            description: "Member updated successfully",
          });
          setEditingMember(null);
          resetForm();
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
      } else {
        const result = await addMember(formData as MemberInsert);
        if (result.success) {
          toast({
            title: "Success",
            description: "Member added successfully",
          });
          resetForm();
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      cycles: 1,
      status: "active",
    });
  };

  const handleEdit = (member: any) => {
    setEditingMember(member.id);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      cycles: member.cycles,
      status: member.status,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      const result = await deleteMember(id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Member deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }
  };

  const cancelEdit = () => {
    setEditingMember(null);
    resetForm();
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingMember ? "Edit Member" : "Add New Member"}
          </CardTitle>
          <CardDescription>
            {editingMember
              ? "Update member information"
              : "Add a member to the chit fund"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member-name">Full Name</Label>
                <Input
                  id="member-name"
                  placeholder="Enter member name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-email">Email</Label>
                <Input
                  id="member-email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-phone">Phone</Label>
                <Input
                  id="member-phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-cycles">Number of Cycles</Label>
                <Input
                  id="member-cycles"
                  type="number"
                  min="1"
                  placeholder="Enter number of cycles"
                  value={formData.cycles}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cycles: parseInt(e.target.value) || 1,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-status">Status</Label>
                <select
                  id="member-status"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as "active" | "inactive",
                    }))
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingMember ? "Update Member" : "Add Member"}
              </Button>
              {editingMember && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
          <CardDescription>
            All registered members ({members.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading members...</span>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No members found. Add your first member above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Name</th>
                    <th className="text-left py-2 px-2">Email</th>
                    <th className="text-left py-2 px-2">Phone</th>
                    <th className="text-left py-2 px-2">Cycles</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-left py-2 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2 font-medium">{member.name}</td>
                      <td className="py-2 px-2 text-muted-foreground">
                        {member.email}
                      </td>
                      <td className="py-2 px-2">{member.phone}</td>
                      <td className="py-2 px-2">{member.cycles}</td>
                      <td className="py-2 px-2">
                        <Badge
                          variant={
                            member.status === "active" ? "default" : "secondary"
                          }
                        >
                          {member.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={() => handleEdit(member)}
                            disabled={editingMember === member.id}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
