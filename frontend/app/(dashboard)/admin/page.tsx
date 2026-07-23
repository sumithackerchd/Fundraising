"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCampaigns: 0,
    pendingCampaigns: 0,
    totalDonations: 0,
  });

  useEffect(() => {
    // Mocking stats fetch
    const fetchStats = async () => {
      try {
        setStats({
          totalUsers: 150,
          totalCampaigns: 45,
          pendingCampaigns: 5,
          totalDonations: 25000,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-['Montserrat'] mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-['Montserrat']">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-['Montserrat']">{stats.totalCampaigns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-['Montserrat'] text-yellow-600">{stats.pendingCampaigns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-['Montserrat'] text-green-600">${stats.totalDonations}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/campaigns" className="block text-black hover:text-gray-600 underline">
              Manage Campaigns
            </Link>
            <Link href="/admin/users" className="block text-black hover:text-gray-600 underline">
              Manage Users
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
